const route = require('express').Router()
const user = require('../../app/controllers/user')

route.post('/', user.addUser)

module.exports = route