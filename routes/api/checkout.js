const route = require('express').Router()
const auth = require('../../app/middlewares/auth')
const Checkout = require('../../app/controllers/checkout')

route.post('/', auth.access, Checkout.checkout)
route.get('/', auth.access, Checkout.getHistory)

module.exports = route