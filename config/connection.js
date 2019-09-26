const Sequelize = require('sequelize')
const redis = require('redis')
const config = require('./database')

module.exports = {
    redis: redis.createClient(),
    sequelize: new Sequelize(config[process.env.NODE_ENV || 'development'])
}