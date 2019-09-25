const joi = require('joi')

module.exports = {
    updateSchema: joi.object().keys({
        email: joi.string().trim().lowercase().email({ minDomainAtoms: 2 }),
        password: joi.string().min(6)
    }).options({ stripUnknown: true }),
    addSchema: joi.object().keys({
        email: joi.string().trim().lowercase().email({ minDomainAtoms: 2 }).required(),
        password: joi.string().min(6).required()
    }).options({ stripUnknown: true })
}
