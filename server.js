const express = require('express')
const { sequelize } = require('./models')
const { default: errorHandler } = require('./middlewares/ErrorHandler')
const UserRouter = require('./routers/UserRouter')

class Server{
    constructor() {
        this.host = 'localhost'
        this.port = 8080
        this.app = express()

    }

    start() {
        
        sequelize.sync({alter: true})
        
        this.app.use(express.json())
        this.app.use(express.urlencoded())

        this.app.get('/', (req, res, next) => {
            res.send("<h1>placeholder</h1>")
        })

        this.app.use(new UserRouter().start())

        this.app.use(errorHandler)

    }
}

new Server().start()