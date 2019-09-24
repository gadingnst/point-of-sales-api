const uuid = require('uuid/v4')
const { compare } = require('bcrypt')
const { sign, verify } = require('jsonwebtoken')
const { User } = require('../../database/models')
const HttpError = require('../../utils/HttpError')

const secretKey = uuid()

class AuthController {
    static async login(req, res) {
        try {
            const { email, password } = req.body
            const data = await User.findOne({ where: { email } })

            if (!data)
                throw new HttpError(404, 'Not Found', `Can't find user with email: ${email}`)

            if (!(await compare(password, data.password)))
                throw new HttpError(403, 'Forbidden', 'Your password is invalid!')

            delete data.dataValues.password

            res.send({
                code: 200,
                status: 'OK',
                message: 'Login Success!',
                data: {
                    ...data.dataValues,
                    token: sign({ ...data.dataValues }, secretKey)
                }
            })
        } catch (err) {
            HttpError.handle(res, err)
        }
    }

    static async logout(req, res) {
        // TODO
        res.end()
    }
}

module.exports = AuthController