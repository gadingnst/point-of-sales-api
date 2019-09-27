const route = require('express').Router()
const product = require('../app/controllers/product')
const api = require('./api')
const auth = require('./auth')

route.use('/api', api)
route.use('/auth', auth)

route.get('/files/image/product/:image', product.getImageProduct)

route.get('*', (req, res) => {
    res.status(404).send({
        code: 404,
        status: 'Not Found',
        message: `Can't ${req.method} the route: '${req.url}'!`,
        error: true
    })
})

module.exports = route