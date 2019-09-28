const route = require('express').Router()
const auth = require('../../app/middlewares/auth')
const Category = require('../../app/controllers/category')

route.get('/', Category.getCategory)
route.get('/:id', Category.getOneCategory)
route.post('/', auth.access, Category.addCategory)
route.put('/:id', auth.access, Category.updateCategory)
route.delete('/:id', auth.access, Category.deleteCategory)

module.exports = route