const route = require('express').Router()
const user = require('./user')
const product = require('./product')
const category = require('./category')

route.use('/user', user)
route.use('/product', product)
route.use('/category', category)

module.exports = route