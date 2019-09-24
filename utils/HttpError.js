class HttpError extends Error {
    constructor(code, status, message) {
        super(JSON.stringify({ code, status, message, error: true }))
        Error.captureStackTrace(this, HttpError)
    }

    static handle(res, err) {
        if (err instanceof this) {
            const error = JSON.parse(err.message)
            console.error(error)
            res.status(error.code).send(error)
        } else {
            console.error(err.stack)
            res.status(500).send({
                code: 500,
                status: 'Internal server error!',
                message: 'An error occured in server!',
                error: true
            })
        }
    }
}

module.exports = HttpError