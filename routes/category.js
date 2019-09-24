const route = require('express').Router()
const Category = require('../app/controllers/category')

route.get('/', Category.getCategory)
route.post('/', Category.addCategory)
route.put('/:id', Category.updateCategory)
route.delete('/:id', Category.deleteCategory)

module.exports = route