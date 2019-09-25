const route = require('express').Router()
const product = require('./product')
const category = require('./category')

route.use('/product', product)
route.use('/category', category)

module.exports = route