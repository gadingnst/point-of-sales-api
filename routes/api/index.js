const route = require('express').Router()
const product = require('./product')
const category = require('./category')
const user = require('./user')

route.use('/user', user)
route.use('/product', product)
route.use('/category', category)

module.exports = route