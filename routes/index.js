const route = require('express').Router()
const product = require('../app/controllers/product')
const api = require('./api')

route.use('/api', api)

route.get('/file/image/product/:id', product.getImageProduct)

route.get('*', (req, res) => {
    res.status(404).send({
        code: 404,
        status: 'Not Found',
        message: `Can't find the route: '${req.url}'!`,
        error: true
    })
})

module.exports = route