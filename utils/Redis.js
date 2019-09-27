const { redis } = require('../config/connection')

module.exports = {
    base: redis,
    get: key => new Promise((resolve, reject) => {
        redis.get(key, (err, reply) => {
            if (err) return reject(err)
            return reply ? resolve(JSON.parse(reply)) : resolve(false)
        })
    }),
    setex: (key, expired, value) => (
        redis.setex(key, expired, JSON.stringify(value))
    )
}