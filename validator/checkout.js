const joi = require('joi')

module.exports = {
    addSchema: joi.object().keys({
        user: joi.string().guid().required(),
        receipt: joi.string().trim().min(13).required(),
        amount: joi.number().min(0).required(),
        orders: joi.array().items(joi.object({
            product: joi.string().guid().required(),
            quantity: joi.number().min(1).required(),
            price: joi.number().min(0).required()
        })).required()
    })
}