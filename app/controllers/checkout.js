const { Checkout, Order } = require('../models')
const { addSchema } = require('../../validator/checkout')
const Sequelize = require('sequelize')
const moment = require('moment')
const validate = require('../../validator')
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
            orders = await Order.bulkCreate(orders.map(data => ({
                ...data, checkout: checkout.id
            })), { individualHooks: true })

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

    static async getHistory(req, res) {
        try {
            let enumerate, labels = []
            const history = { recent: [], last: [] }
            const mode = req.query.mode ? req.query.mode.toLowerCase() : 'week'
            const group = { week: 'DATE', month: 'WEEK', year: 'MONTH' }

            if (!(mode in group))
                throw new HttpError(405, 'Method not allowed', `Allowed mode is ${Object.keys(group)}`)

            history.recent[1] = moment().format()
            history.recent[0] = moment().subtract(1, mode).format()
            history.last[1] = moment(history.recent[0]).format()
            history.last[0] = moment(history.last[1]).subtract(1, mode)

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
                case 'month':
                    // TODO 
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
                    throw new HttpError(405, 'Method not allowed', `Allowed mode is ${Object.keys(group)}`)
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

// SELECT DISTINCT DATE(created_at) as date, COUNT(id) as checkouts, SUM(amount) as income FROM checkouts WHERE created_at BETWEEN '2019-10-01' AND '2019-10-12' GROUP BY DATE(created_at)
// SELECT u.name, c.amount, c.receipt, c.id, p.name as product_name from orders as o JOIN checkouts as c ON o.checkout = c.id JOIN users as u ON c.user = u.id LEFT OUTER JOIN products as p ON o.product = p.id WHERE c.created_at BETWEEN '2019-10-10' AND '2019-10-12'