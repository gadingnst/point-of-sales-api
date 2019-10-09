const { Checkout, Order } = require('../models')
const { addSchema } = require('../../validator/checkout')
const validate = require('../../validator')
const HttpError = require('../../utils/HttpError')

class CheckoutController {
    
    static async checkout(req, res) {
        try {
            const { value } = validate(req.body, addSchema)
            let checkout = { ...value }
            let orders = [...value.orders]
            delete checkout.orders
            
            checkout = await new Checkout(checkout).save()
            orders = await Order.bulkCreate(orders.map(data => ({
                ...data, checkout: checkout.id
            })), { individualHooks: true })

            res.send({
                code: 201,
                status: 'Created',
                message: 'Checkout success!',
                data: { checkout, orders }
            })
        } catch (err) {
            HttpError.handle(res, err)
        }
    }

}

module.exports = CheckoutController