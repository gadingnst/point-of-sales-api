const { Checkout, Order, User, Product, Category } = require('../models')
const { addSchema } = require('../../validator/checkout')
const Sequelize = require('sequelize')
const moment = require('moment')
const validate = require('../../validator')
const redis = require('../../utils/Redis')
const HttpError = require('../../utils/HttpError')
const { enumerateDateByPeriod } = require('../../utils/Date')

class CheckoutController {
    
    static async checkout(req, res) {
        try {
            const { value } = validate(req.body, addSchema)
            let checkout = { ...value }
            let orders = [...value.orders]
            delete checkout.orders
            
            checkout = await new Checkout(checkout).save()
            const [orderData] = await Promise.all([
                Order.bulkCreate(orders.map(data => ({
                    ...data, checkout_id: checkout.id
                })), { individualHooks: true }),
                ...orders.map(data => (
                    Product.findByPk(data.product_id)
                        .then(product => {
                            product.stock = product.stock - data.quantity
                            if (product.stock < 0)
                                throw new HttpError(409, 'Validation Error', `Can't reduce product stock below 0!`)
                            product.save()
                        })
                        .catch(async err => {
                            await Order.destroy({ where: { checkout_id: checkout.id } })
                            await Checkout.destroy({ where: { receipt: checkout.receipt } })
                            throw err
                        })
                ))
            ])

            orders = orderData
            redis.base.flushdb()

            res.send({
                code: 201,
                status: 'Created',
                message: 'Checkout success!',
                data: { checkout, orders }
            })
        } catch (err) {
            HttpError.handle(res, err)
        }
    }

    static async getDailyHistory(req, res) {
        const { limit = 15 } = req.query
        let history = {
            recent: [
                moment().subtract(1, 'day').format(),
                moment().format()
            ],
            last: [
                moment().subtract(2, 'day').format(),
                moment().subtract(1, 'day').format()
            ]
        }

        const config = date => ({
            order: [['createdAt', 'DESC']],
            where: {
                created_at: {
                    [Sequelize.Op.between]: date
                }
            },
            attributes: { exclude: ['user_id'] },
            include: [
                {
                    model: User,
                    as: 'User',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: Order,
                    attributes: ['id', 'quantity', 'price'],
                    include: [
                        {
                            model: Product,
                            include: [{ model: Category, as: 'Category', attributes: ['id', 'name'] }],
                            as: 'Product',
                            attributes: ['id', 'name', 'description', 'image', 'price', 'stock']
                        }
                    ]
                }
            ]
        })

        const [recent, last, data] = await Promise.all([
            Checkout.findAll(config(history.recent)),
            Checkout.findAll(config(history.last)),
            Checkout.findAll({ limit, offset: 0, ...config(history.recent) })
        ])

        res.send({
            code: 200,
            status: 'OK',
            message: `Success fetching daily revenue`,
            data: {
                recentIncome: recent.reduce((acc, cur) => acc + cur.amount, 0),
                lastIncome: last.reduce((acc, cur) => acc + cur.amount, 0),
                data
            }
        })
    }

    static async getOrders(req, res) {
        try {
            let { recent, limit, page = 1 } = req.query
            const conditions = { order: [['createdAt', 'DESC']] }
            
            if (recent) {
                let date
                switch (recent.toLowerCase()) {
                    case 'daily':
                        date = [
                            moment().subtract(1, 'day').format(),
                            moment().format()
                        ]
                        break
                    case 'weekly':
                        date = [
                            moment().subtract(1, 'week').format(),
                            moment().format()
                        ]
                        break
                    case 'monthly':
                        date = [
                            moment().subtract(1, 'month').format(),
                            moment().format()
                        ]
                        break
                    case 'yearly':
                        date = [
                            moment().subtract(1, 'year').format(),
                            moment().format()
                        ]
                        break
                    default:
                        throw new HttpError(405, 'Method not allowed', 'Recent must be daily, weekly, monthly and yearly')
                }
                conditions.where = {
                    created_at: { [Sequelize.Op.between]: date }
                }
            }

            if (limit) {
                limit = Number.parseInt(limit < 1 ? 1 : limit)
                page = Number.parseInt(page < 1 ? 1 : page)

                if (Number.isNaN(limit) || Number.isNaN(page))
                    throw new HttpError(400, 'Bad Request', 'Request query (limit or page) must be a number!')
                
                conditions.limit = limit
                conditions.offset = (page - 1) * limit
            }

            const config = {
                ...conditions,
                attributes: { exclude: ['user_id'] },
                include: [
                    {
                        model: User,
                        as: 'User',
                        attributes: ['id', 'name', 'email']
                    },
                    {
                        model: Order,
                        attributes: ['id', 'quantity', 'price'],
                        include: [
                            {
                                model: Product,
                                include: [{ model: Category, as: 'Category', attributes: ['id', 'name'] }],
                                as: 'Product',
                                attributes: ['id', 'name', 'description', 'image', 'price', 'stock']
                            }
                        ]
                    }
                ]
            }

            const [data, count] = await Promise.all([
                Checkout.findAll(config),
                new Promise((resolve, reject) => {
                    delete config.limit
                    delete config.offset
                    Checkout.findAll(config)
                        .then(data => resolve(data.length))
                        .catch(err => reject(err))
                })
            ])

            res.send({
                code: 200,
                status: 'OK',
                message: `Success fetching revenue by ${mode}`,
                data: { mode, labels, recent, last }
            })
            
            res.send({
                code: 200,
                status: 'OK',
                message: !!count ? 'Success fetching all orders' : 'No orders available',
                data: {
                    totalRows: count,
                    totalPage: Math.ceil(count / (limit || count)),
                    rows: data
                }
            })
        } catch (err) {
            HttpError.handle(res, err)
        }
    }

    static async getStatistic(req, res) {
        try {
            let enumerate, labels = []
            const history = { recent: [], last: [] }
            const mode = req.query.mode ? req.query.mode.toLowerCase().replace(/ly/, '') : 'week'
            const group = { week: 'DATE', year: 'MONTH' }

            if (!(mode in group))
                throw new HttpError(405, 'Method not allowed', `Allowed mode is ${Object.keys(group).map(mode => `${mode}ly`)}`)

            history.recent[1] = moment().format()
            history.recent[0] = moment().subtract(1, mode).format()
            history.last[1] = moment(history.recent[0]).format()
            history.last[0] = moment(history.last[1]).subtract(1, mode).format()

            const enumeratePeriod = (history, mode) => (
                Object.keys(enumerateDateByPeriod(history[0], history[1], mode))
            )

            const findHistory = history => Checkout.findAll({
                group: [Sequelize.fn(group[mode], Sequelize.col('created_at'))],
                where: { created_at: { [Sequelize.Op.between]: history } },
                order: [[Sequelize.fn('DATE', Sequelize.col('created_at'))]],
                attributes: [
                    [Sequelize.fn('DISTINCT DATE', Sequelize.col('created_at')), 'date'],
                    [Sequelize.fn('COUNT', Sequelize.col('id')), 'checkouts'],
                    [Sequelize.fn('SUM', Sequelize.col('amount')), 'income']
                ]
            })

            let [recent, last] = await Promise.all([
                findHistory(history.recent),
                findHistory(history.last)
            ])

            recent = JSON.parse(JSON.stringify(recent))
            last = JSON.parse(JSON.stringify(last))

            switch (mode) {
                case 'week':
                    enumerate = enumeratePeriod(history.recent, 'day')
                    labels = enumerate.map(date => moment(date).format('dddd').slice(0, 3))
                    recent = enumerate.map((date, i) => {
                        const data = recent.find(rec => rec.date === date)
                        if (data)
                            return {
                                date: moment(date).format('YYYY-MM-DD'),
                                label: labels[i],
                                checkouts: data.checkouts,
                                income: data.income
                            }
                        return {
                            date: moment(date).format('YYYY-MM-DD'),
                            label: labels[i],
                            checkouts: 0,
                            income: 0
                        }
                    })

                    enumerate = enumeratePeriod(history.last, 'day')
                    labels = enumerate.map(date => moment(date).format('dddd').slice(0, 3))
                    last = enumerate.map((date, i) => {
                        const data = last.find(rec => rec.date === date)
                        if (data)
                            return {
                                date: moment(date).format('YYYY-MM-DD'),
                                label: labels[i],
                                checkouts: data.checkouts,
                                income: data.income
                            }
                        return {
                            date: moment(date).format('YYYY-MM-DD'),
                            label: labels[i],
                            checkouts: 0,
                            income: 0
                        }
                    })
                    break
                case 'year':
                    enumerate = enumeratePeriod(history.recent, 'month').map(date => moment(date).format('YYYY-MM'))
                    labels = enumerate.map(date => moment(date).format('MMMM').slice(0, 3))
                    recent = enumerate.map((date, i) => {
                        const data = recent.find(rec => moment(rec.date).format('YYYY-MM') === date)
                        if (data)
                            return {
                                date: moment(date).format('YYYY-MM'),
                                label: labels[i],
                                checkouts: data.checkouts,
                                income: data.income
                            }
                        return {
                            date: moment(date).format('YYYY-MM'),
                            label: labels[i],
                            checkouts: 0,
                            income: 0
                        }
                    })

                    enumerate = enumeratePeriod(history.last, 'month').map(date => moment(date).format('YYYY-MM'))
                    labels = enumerate.map(date => moment(date).format('MMMM').slice(0, 3))
                    last = enumerate.map((date, i) => {
                        const data = last.find(rec => moment(rec.date).format('YYYY-MM') === date)
                        if (data)
                            return {
                                date: moment(date).format('YYYY-MM'),
                                label: labels[i],
                                checkouts: data.checkouts,
                                income: data.income
                            }
                        return {
                            date: moment(date).format('YYYY-MM'),
                            label: labels[i],
                            checkouts: 0,
                            income: 0
                        }
                    })
                    break
                default:    
                    throw new HttpError(405, 'Method not allowed', `Allowed mode is ${Object.keys(group).map(mode => `${mode}ly`)}`)
            }

            res.send({
                code: 200,
                status: 'OK',
                message: `Success fetching revenue by ${mode}`,
                data: { mode, labels, recent, last }
            })
        } catch (err) {
            HttpError.handle(res, err)
        }
    }

}

module.exports = CheckoutController