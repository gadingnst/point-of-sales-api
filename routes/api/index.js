const route = require('express').Router()
const product = require('./product')
const category = require('./category')
const user = require('./user')
const checkout = require('./checkout')

route.use('/checkout', checkout)
route.use('/user', user)
route.use('/product', product)
route.use('/category', category)

module.exports = route