const { compare } = require('bcrypt')
const { sign, verify } = require('jsonwebtoken')
const { User } = require('../models')
const { addSchema } = require('../../validator/user')
const { jwtSecretKey } = require('../../config')
const validate = require('../../validator')
const HttpError = require('../../utils/HttpError')

module.exports = {
    register: async (req, res, next) => {
        try {
            const { value } = validate(req.body, addSchema)
            const result = await new User(value).save()
            delete result.dataValues.password
            res.locals.data = result
            
            next()
        } catch (err) {
            HttpError.handle(res, err)
        }
    },
    attempt: async (req, res, next) => {
        try {
            const { email, password } = req.body
            const data = await User.findOne({ where: { email } })

            if (!data)
                throw new HttpError(404, 'Not Found', `Can't find user with email: ${email}`)

            if (!(await compare(password, data.password)))
                throw new HttpError(403, 'Forbidden', 'Your password is invalid!')

            delete data.dataValues.password

            res.locals.data = {
                token: sign({ ...data.dataValues }, jwtSecretKey)
            }

            next()
        } catch (err) {
            HttpError.handle(res, err)
        }
    },
    access: (req, res, next) => {
        try {
            const authToken = req.headers.authorization
            
            if (!authToken)
                throw new HttpError(401, 'Unauthorized', `Authorization token has not been set`)
            
            try {
                res.locals.data = verify(authToken, jwtSecretKey)
                next()
            } catch (err) {
                throw new HttpError(401, 'Unauthorized', `Invalid Token`)
            }
        } catch (err) {
            HttpError.handle(res, err)
        }
    }
}