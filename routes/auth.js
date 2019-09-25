const route = require('express').Router()
const middleware = require('../app/middlewares/auth')
const controller = require('../app/controllers/auth')

route.post('/register', middleware.register, controller.add)
route.post('/login', middleware.attempt, controller.login)

module.exports = route