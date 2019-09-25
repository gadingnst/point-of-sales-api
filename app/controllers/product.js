const fs = require('fs').promises
const { resolve: pathResolve } = require('path')
const { Op } = require('sequelize') 
const { Product, Category } = require('../../database/models')
const { updateSchema, addSchema } = require('../../validator/product')
const validate = require('../../validator')
const { fileExist } = require('../../utils/FileHelper')
const HttpError = require('../../utils/HttpError')

const uploadPath = 'storage/uploads'
const basedir = `${__dirname}/../..`

class ProductController {

    static async addProduct(req, res) {
        try {
            const { value } = validate(req.body, addSchema)
            const image = req.files.image
            if (image) {
                const uniqueNumber = Date.now()
                const imageName = `${value.name.toLowerCase().replace(/\s+/g, '-')}_${uniqueNumber}.${image.mimetype.split('/')[1]}`
                image.mv(`${uploadPath}/images/products/${imageName}`)
                value.image = imageName
            }
            const result = await new Product(value).save()
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
            let conditions = { order: [['created_at', 'ASC']] }
            let { 
                search, category, limit, sort, page = 1 
            } = req.query
                
            if (search) {
                conditions = {
                    where: { name: { [Op.substring]: req.query.search } }
                }
            }

            if (limit) {
                limit = Number.parseInt(limit)
                page = Number.parseInt(page)

                if (Number.isNaN(limit) || Number.isNaN(page))
                    throw new HttpError(400, 'Bad Request', 'Request query (limit or page) must be a number!')
                
                conditions = { ...conditions, limit, offset: (page - 1) * limit }
            }

            if (category) {
                conditions.where = { ...conditions.where, category_id: category }
            }

            if (sort) {
                const sortingFields = ['name', 'category', 'price', 'created_at', 'updated_at']
                let [field, order] = sort.toLowerCase().split('-')

                field = !!sortingFields.find(val => field === val) || 'created_at'

                if (!(order in sorting))
                    throw new HttpError(405, 'Method not allowed', 'Sorting method must be: ASC or DESC!')

                conditions.order = [[field, sorting[order]]]
            }

            const data = await Product.findAll({
                ...conditions,
                include: [{ model: Category, as: 'category' }],
                attributes: {
                    exclude: ['category_id', 'image']
                }
            })

            res.send({
                code: 200,
                status: 'OK',
                message: !!data.length ? 'Success fetching all products' : 'No product available',
                data
            })
        } catch (err) {
            HttpError.handle(res, err)
        }
    }

    static async getOneProduct(req, res) {
        try {
            const data = await Product.findByPk(req.params.id, {
                include: [{ model: Category, as: 'category' }],
                attributes: {
                    exclude: ['category_id', 'image']
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

            data.destroy()
            fs.unlink(`${uploadPath}/images/products/${data.image}`)
                .catch(err => console.error(err))

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
            const image = req.files.image

            if (image) {
                const uniqueNumber = Date.now()
                const imageName = `${value.name.toLowerCase().replace(/\s+/g, '-')}_${uniqueNumber}.${image.mimetype.split('/')[1]}`
                image.mv(`${uploadPath}/images/products/${imageName}`)
                value.image = imageName
                fs.unlink(`${uploadPath}/images/products/${product.image}`)
                    .catch(err => console.error(err))
            }

            for (const key in value) product[key] = value[key]

            const data = await product.save()

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

    static async getImageProduct(req, res) {
        try {
            const data = await Product.findByPk(req.params.id)
            
            if (!data) 
                throw new HttpError(404, 'Not Found', `Can't find product with id: ${req.params.id}`)

            const imagePath = pathResolve(`${basedir}/${uploadPath}/images/products/${data.image}`)
            
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