const route = require('express').Router()
const Product = require('../app/controllers/product')

route.get('/', Product.getAllProduct)
route.post('/', Product.addProduct)
route.put('/:id', Product.updateProduct)
route.delete('/:id', Product.deleteProduct)

module.exports = route