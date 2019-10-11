const { User } = require('../models')
const { addSchema, updateSchema } = require('../../validator/user')
const validate = require('../../validator')
const HttpError = require('../../utils/HttpError')

class UserController {

    static async registerUser(req, res) {
        try {
            const { value } = validate(req.body, addSchema)
            const result = await new User(value).save()
            delete result.dataValues.password

            res.send({
                code: 200,
                status: 'OK',
                message: 'Success register user data',
                data: result
            })
        } catch (err) {
            HttpError.handle(res, err)
        }
    }

    static async getUser(req, res) {
        try {
            const data = await User.findAll({
                attributes: { exclude: ['password'] }
            })
            res.send({
                code: 200,
                status: 'OK',
                message: 'Success fetching users data',
                data
            })
        } catch (err) {
            HttpError.handle(res, err)
        }
    }

    static async updateUser(req, res) {
        try {
            const user = await User.findByPk(req.params.id)

            if (!user)
                throw new HttpError(404, 'Not Found', `Can't find user with id: ${req.params.id}`)
            
            const { value } = validate(req.body, updateSchema)

            for (const key in value) user[key] = value[key]
            
            const data = await user.save()
            delete user.dataValues.password

            res.send({
                code: 200,
                status: 'OK',
                message: 'Success updating user data',
                data
            })
        } catch (err) {
            HttpError.handle(res, err)
        }
    }

    static async deleteUser(req, res) {
        try {
            const data = await User.findByPk(req.params.id)
            
            if (!data) 
                throw new HttpError(404, 'Not Found', `Can't find user with id: ${req.params.id}`)

            data.destroy()
            delete data.dataValues.password
            
            res.send({
                code: 200,
                status: 'OK',
                message: 'Success deleting user',
                data
            })
        } catch (err) {
            HttpError.handle(res, err)
        }
    }

}

module.exports = UserController