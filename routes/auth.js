const route = require('express').Router()
const auth = require('../app/middlewares/auth')
const controller = require('../app/controllers/auth')

route.post('/login', auth.attempt, controller.login)
route.get('/info', auth.access, controller.info)

module.exports = route