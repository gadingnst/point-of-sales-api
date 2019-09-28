const route = require('express').Router()
const auth = require('../../app/middlewares/auth')
const Product = require('../../app/controllers/product')

route.get('/', Product.getProduct)
route.get('/:id', Product.getOneProduct)
route.post('/', auth.access, Product.addProduct)
route.put('/:id', auth.access, Product.updateProduct)
route.delete('/:id', auth.access, Product.deleteProduct)
route.patch('/stock/:id', auth.access, Product.addAndReduceStockProduct)

module.exports = route