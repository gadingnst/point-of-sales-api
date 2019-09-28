const fs = require('fs').promises
const { resolve: pathResolve } = require('path')
const { Op } = require('sequelize') 
const md5 = require('md5')
const { Product, Category } = require('../models')
const { updateSchema, addSchema, patchStockSchema } = require('../../validator/product')
const validate = require('../../validator')
const { fileExist, uploadImage } = require('../../utils/FileHelper')
const HttpError = require('../../utils/HttpError')
const redis = require('../../utils/Redis')

const uploadPath = 'storage/uploads'
const basedir = `${__dirname}/../..`

class ProductController {

    static async addProduct(req, res) {
        try {
            const { value } = validate(req.body, addSchema)
            let { image } = req.files || {}
            if (image) value.image = uploadImage(image, value.name)
            const result = await new Product(value).save()
            redis.base.flushdb()
            res.send({
                code: 201,
                status: 'Created',
                message: 'Success add new product!',
                data: result
            })
        } catch (err) {
            HttpError.handle(res, err)
        }
    }

    static async getProduct(req, res) {
        try {
            const sorting = { asc: 'ASC', desc: 'DESC' }
            let conditions = { order: [['updatedAt', 'DESC']] }
            let {
                search, category, limit, sort, page = 1 
            } = req.query
                
            if (search) {
                conditions = {
                    ...conditions,
                    where: { name: { [Op.substring]: search } }
                }
            }

            if (limit) {
                limit = Number.parseInt(limit < 1 ? 1 : limit)
                page = Number.parseInt(page < 1 ? 1 : page)

                if (Number.isNaN(limit) || Number.isNaN(page))
                    throw new HttpError(400, 'Bad Request', 'Request query (limit or page) must be a number!')
                
                conditions = { ...conditions, limit, offset: (page - 1) * limit }
            }

            if (category) {
                conditions.where = { ...conditions.where, category: category }
            }

            if (sort) {
                const sortingFields = ['name', 'category', 'price', 'createdAt', 'updatedAt']
                let [field, order] = sort.toLowerCase().split('-')
                const column = sortingFields.find(col => field.includes(col))
                
                if (!column)
                    throw new HttpError(400, 'Bad Request', `Can't sort product by '${field}'`)

                if (!(order in sorting))
                    throw new HttpError(405, 'Method not allowed', 'Sorting method must be: ASC or DESC!')

                conditions.order = [[field, sorting[order]]]
            }

            let data = []
            const cacheKey = `products:${md5(JSON.stringify(conditions) + search)}`
            const reply = await redis.get(cacheKey)

            if (reply) {
                data = reply                
            } else {
                data = await Product.findAndCountAll({
                    ...conditions,
                    include: [{ model: Category, as: 'Category' }],
                    attributes: {
                        exclude: ['category', 'createdAt', 'updatedAt']
                    }
                })

                data = {
                    rows: data.rows,
                    total: data.count,
                    totalPage: Math.ceil(data.count / (limit || data.count))
                }
                
                if (!!data.rows.length) redis.setex(cacheKey, 3600, data)
            }

            res.send({
                code: 200,
                status: 'OK',
                message: !!data.rows.length ? 'Success fetching all products' : 'No product available',
                data
            })
        } catch (err) {
            HttpError.handle(res, err)
        }
    }

    static async getOneProduct(req, res) {
        try {
            const data = await Product.findByPk(req.params.id, {
                include: [{ model: Category, as: 'Category' }],
                attributes: {
                    exclude: ['category']
                }
            })
            
            if (!data) 
                throw new HttpError(404, 'Not Found', `Can't find product with id: ${req.params.id}`)

            res.send({
                code: 200,
                status: 'OK',
                message: 'Success fetching product',
                data
            })
        } catch (err) {
            HttpError.handle(res, err)
        }
    }

    static async deleteProduct(req, res) {
        try {
            const data = await Product.findByPk(req.params.id)

            if (!data)
                throw new HttpError(404, 'Not Found', `Can't find product with id: ${req.params.id}`)

            const oldImagePath = `${uploadPath}/images/products/${data.image}`
            data.destroy()
            redis.base.flushdb()

            fileExist(oldImagePath)
                .then(exist => (
                    !exist || fs.unlink(oldImagePath).catch(err => console.error(err))
                ))

            res.send({
                code: 200,
                status: 'OK',
                message: 'Success deleting product',
                data
            })
        } catch (err) {
            HttpError.handle(res, err)
        }
    }

    static async updateProduct(req, res) {
        try {
            const product = await Product.findByPk(req.params.id)

            if (!product) 
                throw new HttpError(404, 'Not Found', `Can't find product with id: ${req.params.id}`)
            
            const { value } = validate(req.body, updateSchema)
            const { image } = req.files || {}

            if (image) {
                const oldImagePath = `${uploadPath}/images/products/${product.image}`
                value.image = uploadImage(image, value.name)
                fileExist(oldImagePath)
                    .then(exist => (
                        !exist || fs.unlink(oldImagePath).catch(err => console.error(err))
                    ))
            }

            for (const key in value) product[key] = value[key]
            const data = await product.save()
            redis.base.flushdb()

            res.send({
                code: 200,
                status: 'OK',
                message: 'Success updating product',
                data
            })
        } catch (err) {
            HttpError.handle(res, err)
        }
    }

    static async addAndReduceStockProduct(req, res) {
        try {
            const { value: { operator, value } } = validate(req.body, patchStockSchema)
            let product = await Product.findByPk(req.params.id)

            if (!product)
                throw new HttpError(404, 'Not Found', `Can't find product with id: ${req.params.id}`)

            const ops = {
                add: Number.parseInt(product.stock + value),
                reduce: Number.parseInt(product.stock - value)
            }
            
            if (!(operator.toLowerCase() in ops))
                throw new HttpError(405, 'Method Not Allowed', 'Operator only can be a add/reduce!')

            if (ops[operator] < 0)
                throw new HttpError(409, 'Validation Error', `Can't reduce product stock below 0!`)

            product.stock = ops[operator]
            product = await product.save()
            redis.base.flushdb()
            
            res.send({
                code: 200,
                status: 'OK',
                message: `Success ${operator} product stock`,
                data: product
            })
        } catch (err) {
            HttpError.handle(res, err)
        }
    }

    static async getImageProduct(req, res) {
        try {
            const { image } = req.params
            const imagePath = pathResolve(`${basedir}/${uploadPath}/images/products/${image}`)

            if (await fileExist(imagePath)) {
                res.sendFile(imagePath)
            } else {
                res.status(404).sendFile(pathResolve(`${basedir}/storage/placeholders/noimage-placeholder.jpg`))
            }
        } catch (err) {
            HttpError.handle(res, err)
        }
    }
}

module.exports = ProductController