const route = require('express').Router()
const User = require('../../app/controllers/user')

route.put('/:id', User.updateUser)
route.delete('/:id', User.deleteUser)

module.exports = route