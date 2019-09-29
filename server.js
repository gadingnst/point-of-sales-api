require('dotenv').config()

const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const routes = require('./routes')
const { sequelize: db } = require('./config/connection')

const server = express()
const port = process.env.PORT || 9600

server.use(express.urlencoded({ extended: true }))
server.use(express.json())
server.use(cors())
server.use(fileUpload())
server.use(logger('dev'))
server.use(routes)

async function start() {
    try {
        await db.authenticate()
        server.listen(port, () => {
            console.log(`Server running on http://localhost:${port}\n`)
        })
    } catch (err) {
        console.error('An error occured during connecting database:', err)
    }
}

start()