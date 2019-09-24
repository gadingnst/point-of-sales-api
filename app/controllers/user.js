const { User } = require('../../database/models')
const { addSchema, updateSchema } = require('../../validator/user')
const validate = require('../../validator')
const HttpError = require('../../utils/HttpError')

class UserController {
    static async addUser(req, res) {
        try {
            const { value } = validate(req.body, addSchema)
            const result = await new User(value).save()
            delete result.dataValues.password
            res.send({
                code: 201,
                status: 'Created',
                message: 'Success add new user!',
                data: result
            })
        } catch (err) {
            HttpError.handle(res, err)
        }
    }

    static async getOneUser(req, res) {
        try {
            const data = await User.findByPk(req.params.id, {
                attributes: {
                    exclude: ['password']
                }
            })
            
            if (!data)
                throw new HttpError(404, 'Not Found', `Can't find user with id: '${req.params.id}'`)

            res.send({
                code: 200,
                status: 'OK',
                message: 'Success fetch user data!',
                data
            })
        } catch (err) {
            HttpError.handle(res, err)
        }
    }

    static async deleteUser(req, res) {
        // TODO
    }

    static async updateUser(req, res) {
        // TODO
    }
}

module.exports = UserController