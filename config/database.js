require('dotenv').config()

module.exports = {
  development: {
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'mysql',
    database: process.env.DB_NAME || 'posdb',
    host: process.env.DB_HOSTNAME || '127.0.0.1',
    dialect: 'mysql',
    logging: false,
    timezone: '+07:00'
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOSTNAME,
    dialect: 'mysql',
    logging: false,
    dialectOptions: {},
    timezone: '+07:00'
  }
}