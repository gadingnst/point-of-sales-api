const Sequelize = require('sequelize')
const redis = require('redis')
const config = require('./database')

module.exports = {
    redis: process.env.HOST_PROVIDER !== 'heroku' ? redis.createClient() : null,
    sequelize: new Sequelize(config[process.env.NODE_ENV || 'development'])
}