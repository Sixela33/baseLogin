const express = require('express')
const { sequelize } = require('./models')
const UserRouter = require('./routers/UserRouter')
const errorHandler = require('./middlewares/ErrorHandler')
require('dotenv').config()

class Server {
    constructor() {
        this.host = process.env.HOST
        this.port = process.env.PORT
        this.app = express()
    }

    start() {
        
        // sequelize.sync({alter: true})
        
        this.app.use(express.json())
        this.app.use(express.urlencoded())

        this.app.get('/', (req, res, next) => {
            res.send("<h1>placeholder</h1>")
        })

        this.app.use('/api/users', new UserRouter().start())

        this.app.use(errorHandler)

        this.server = this.app.listen(this.port, () =>
            console.log(`Express server listening at: ${this.host}:${this.port}`)
        );
        this.server.on("error", (error) =>
            console.log(`Server Error: \n ${error.message}`)
        );

        return this.app

    }
}

new Server().start()