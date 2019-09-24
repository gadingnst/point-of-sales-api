const joi = require('joi')

module.exports = {
    baseSchema: joi.object().keys({
        name: joi.string().trim().max(255),
        description: joi.string().trim().max(255).default('No product description'),
        category_id: joi.string().guid(),
        price: joi.number().min(0),
        stock: joi.number().min(0)
    }).options({ stripUnknown: true }),
    addSchema: joi.object().keys({
        name: joi.string().trim().max(255).required(),
        description: joi.string().trim().max(255).default('No product description'),
        category_id: joi.string().guid().required(),
        price: joi.number().min(0).required(),
        stock: joi.number().min(0).default(1)
    }).options({ stripUnknown: true })
}