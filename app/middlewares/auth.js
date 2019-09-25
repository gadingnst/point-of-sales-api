const uuid = require('uuid/v4')
const { compare } = require('bcrypt')
const { sign, verify } = require('jsonwebtoken')
const { Auth } = require('../../database/models')
const { addSchema } = require('../../validator/auth')
const validate = require('../../validator')
const HttpError = require('../../utils/HttpError')

const secretKey = uuid()

module.exports = {
    register: async (req, res, next) => {
        try {
            const { value } = validate(req.body, addSchema)
            const result = await new Auth(value).save()
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
            const data = await Auth.findOne({ where: { email } })

            if (!data)
                throw new HttpError(404, 'Not Found', `Can't find auth with email: ${email}`)

            if (!(await compare(password, data.password)))
                throw new HttpError(403, 'Forbidden', 'Your password is invalid!')

            delete data.dataValues.password

            res.locals.data = {
                ...data.dataValues,
                token: sign({ ...data.dataValues }, secretKey)
            }

            next()
        } catch (err) {
            HttpError.handle(res, err)
        }
    },
    info: (req, res, next) => {
        
    },
    access: (req, res, next) => {

    }
}