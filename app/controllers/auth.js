class AuthController {

    static async login(req, res) {
        const { data } = res.locals
        res.send({
            code: 200,
            status: 'OK',
            message: 'Success login',
            data
        })
    }

    static async info(req, res) {
        const { data } = res.locals
        res.send({
            code: 200,
            status: 'OK',
            message: 'Success fetch auth data',
            data
        })
    }
    
}

module.exports = AuthController