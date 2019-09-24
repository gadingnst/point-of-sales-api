const fs = require('fs').promises
const { Category } = require('../../database/models')
const { validateRequest, validateId } = require('../../validator')
const { baseSchema, addSchema } = require('../../validator/category')
const HttpError = require('../../utils/HttpError')

class CategoryController {
    
    static async addCategory(req, res) {
        try {
            const { value } = validateRequest(req.body, addSchema)
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

    static async deleteCategory(req, res) {
        try {
            const id = validateId(req.params.id)
            const data = await Category.destroy({ where: { id } })
            if (!data) 
                throw new HttpError(404, 'Not Found', `Can't find category with id: ${id}`)
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
            const id = validateId(req.params.id)
            const { value } = validateRequest(req.body, baseSchema)
            const category = await Category.findOne({ where: { id } })

            if (!category) 
                throw new HttpError(404, 'Not Found', `Can't find category with id: ${id}`)
            
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