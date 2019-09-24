const joi = require('joi')

module.exports = {
    updateSchema: joi.object().keys({
        name: joi.string().trim().max(255)
    }).options({ stripUnknown: true }),
    addSchema: joi.object().keys({
        name: joi.string().trim().max(255).required()
    }).options({ stripUnknown: true })
}
