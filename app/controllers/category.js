const { Category } = require('../models')
const { updateSchema, addSchema } = require('../../validator/category')
const validate = require('../../validator')
const HttpError = require('../../utils/HttpError')

class CategoryController {
    
    static async addCategory(req, res) {
        try {
            const { value } = validate(req.body, addSchema)
            const result = await new Category(value).save()
            res.send({
                code: 201,
                status: 'Created',
                message: 'Success add new category product!',
                data: result
            })
        } catch (err) {
            HttpError.handle(res, err)
        }
    }

    static async getCategory(req, res) {
        try {
            const data = await Category.findAll()
            res.send({
                code: 200,
                status: 'OK',
                message: !!data.length ? 'Success fetching all category product' : 'No category available',
                data
            })
        } catch (err) {
            HttpError.handle(res, err)
        }
    }

    static async getOneCategory(req, res) {
        try {
            const data = await Category.findByPk(req.params.id)
            
            if (!data) 
                throw new HttpError(404, 'Not Found', `Can't find category with id: ${req.params.id}`)

            res.send({
                code: 200,
                status: 'OK',
                message: 'Success fetching category',
                data
            })
        } catch (err) {
            HttpError.handle(res, err)
        }
    }

    static async deleteCategory(req, res) {
        try {
            const data = await Category.findByPk(req.params.id)
            
            if (!data) 
                throw new HttpError(404, 'Not Found', `Can't find category with id: ${req.params.id}`)

            data.destroy()

            res.send({
                code: 200,
                status: 'OK',
                message: 'Success deleting category product',
                data
            })
        } catch (err) {
            HttpError.handle(res, err)
        }
    }

    static async updateCategory(req, res) {
        try {
            const category = await Category.findByPk(req.params.id)

            if (!category) 
                throw new HttpError(404, 'Not Found', `Can't find category with id: ${req.params.id}`)
            
            const { value } = validate(req.body, updateSchema)

            for (const key in value) category[key] = value[key]
            
            const data = await category.save()
            
            res.send({
                code: 200,
                status: 'OK',
                message: 'Success update category product',
                data
            })
        } catch (err) {
            HttpError.handle(res, err)
        }
    }
}

module.exports = CategoryController