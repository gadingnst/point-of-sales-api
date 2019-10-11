const { compare } = require('bcrypt')
const { sign, verify } = require('jsonwebtoken')
const { User } = require('../models')
const { addSchema, loginSchema } = require('../../validator/user')
const { jwtSecretKey } = require('../../config')
const validate = require('../../validator')
const HttpError = require('../../utils/HttpError')

module.exports = {
    attempt: async (req, res, next) => {
        try {
            const { value: { email, password } } = validate(req.body, loginSchema)
            const data = await User.findOne({ where: { email } })

            if (!data)
                throw new HttpError(404, 'Not Found', `Can't find user with email: ${email}`)

            if (!(await compare(password, data.password)))
                throw new HttpError(403, 'Forbidden', 'Your password is invalid!')

            delete data.dataValues.password

            res.locals.data = {
                user: { ...data.dataValues },
                token: sign({ ...data.dataValues }, jwtSecretKey)
            }

            next()
        } catch (err) {
            HttpError.handle(res, err)
        }
    },
    access: (req, res, next) => {
        try {
            let authToken = req.headers.authorization
            
            if (!authToken)
                throw new HttpError(401, 'Unauthorized', `Authorization token has not been set`)
            
            try {
                authToken = authToken.split(/\s+/)[1]
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
