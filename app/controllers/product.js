const fs = require('fs').promises
const { Product, Category } = require('../../database/models')
const { validateRequest, validateId } = require('../../validator')
const { baseSchema, addSchema } = require('../../validator/product')
const HttpError = require('../../utils/HttpError')

const uploadPath = 'storage/uploads'
class ProductController {

    static async addProduct(req, res) {
        try {
            const { value } = validateRequest(req.body, addSchema)
            const image = req.files.image
            if (image) {
                const uniqueNumber = Date.now()
                const imageName = `${value.name.toLowerCase().replace(/ /g, '-')}_${uniqueNumber}.${image.mimetype.split('/')[1]}`
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

    static async getAllProduct(req, res) {
        try {
            const data = await Product.findAll({
                include: [{ model: Category }]
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

    static async deleteProduct(req, res) {
        try {
            const id = validateId(req.params.id)
            const data = await Product.findOne({ where: { id } })

            if (!data)
                throw new HttpError(404, 'Not Found', `Can't find product with id: ${id}`)

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
            const id = validateId(req.params.id)
            const { value } = validateRequest(req.body, baseSchema)
            const product = await Product.findOne({ where: { id } })
            const image = req.files.image

            if (!product) 
                throw new HttpError(404, 'Not Found', `Can't find product with id: ${id}`)

            if (image) {
                const uniqueNumber = Date.now()
                const imageName = `${value.name.replace(/ /g, '-')}_${uniqueNumber}.${image.mimetype.split('/')[1]}`
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
}

module.exports = ProductController