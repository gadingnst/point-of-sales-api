const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const routes = require('./routes')
const db = require('./database/connection')

const server = express()
const port = process.env.PORT || 9600

server.use(express.urlencoded({ extended: true }))
server.use(express.json())
server.use(cors())
server.use(fileUpload())
server.use(logger('dev'))
server.use('/api', routes)

async function start() {
    try {
        await db.authenticate()
        server.listen(port, () => {
            console.log(`server running on http://localhost:${port}`)
        })
    } catch (err) {
        console.error('an error occured during connecting database:', err)
    }
}

start()