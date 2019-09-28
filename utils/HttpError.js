class HttpError extends Error {
    constructor(code, status, message) {
        super(JSON.stringify({ code, status, message, error: true }))
        Error.captureStackTrace(this, this.constructor)
    }

    static handle(res, err) {
        if (err instanceof this) {
            const error = JSON.parse(err.message)
            console.error(error)
            return res.status(error.code).send(error)
        }

        console.error(err)

        if (err.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(400).send({
                code: 400,
                status: 'Bad Request',
                message: `Reference foreign key error on table '${err.table}' to fields: '${err.fields.join(', ')}'`,
                error: true
            })
        }

        if (err.name === 'SequelizeUniqueConstraintError') {
            const { path, value } = err.errors[0]
            return res.status(400).send({
                code: 400,
                status: 'Bad Request',
                message: `${path} ${value} already taken!`,
                error: true
            })
        }

        res.status(500).send({
            code: 500,
            status: 'Internal server error!',
            message: 'An error occured in server!',
            error: true
        })
    }
}

module.exports = HttpError