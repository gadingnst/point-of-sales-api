const joi = require('joi')
const HttpError = require('../utils/HttpError')

module.exports = (request, validationSchema) => {
    const valid = joi.validate(request, validationSchema)
    if (valid.error)
        throw new HttpError(409, 'Validation Error', valid.error.details[0].message)
    return valid
}