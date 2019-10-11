const route = require('express').Router()
const auth = require('../../app/middlewares/auth')
const User = require('../../app/controllers/user')

route.get('/', auth.access, User.getUser)
route.post('/', auth.access, User.registerUser)
route.put('/:id', auth.access, User.updateUser)
route.delete('/:id', auth.access, User.deleteUser)

module.exports = route