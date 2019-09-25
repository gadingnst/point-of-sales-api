class AuthController {
    
    static async add(req, res) {
        const { data } = res.locals
        res.send({
            code: 200,
            status: 'OK',
            message: 'Success register auth',
            data
        })
    }

    static async login(req, res) {
        const { data } = res.locals
        res.send({
            code: 200,
            status: 'OK',
            message: 'Success login',
            data
        })
    }
    
}

module.exports = AuthController