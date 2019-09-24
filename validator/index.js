const joi = require('joi')
const HttpError = require('../utils/HttpError')

module.exports = {
    validateRequest: (request, validationSchema) => {
        const valid = joi.validate(request, validationSchema)
        if (valid.error)
            throw new HttpError(409, 'Validation Error', valid.error.details[0].message)
        return valid
    },
    validateId: id => {
        const valid = joi.validate(id, joi.string().guid())
        if (valid.error)
            throw new HttpError(304, 'Params Error', 'Request param id must be a UUID!')
        return valid.value
    }
}