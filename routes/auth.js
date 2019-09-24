const route = require('express').Router()
const auth = require('../app/controllers/auth')

route.post('/login', auth.login)
route.post('/logout', auth.logout)

module.exports = route