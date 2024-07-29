const express = require('express')
const { sequelize } = require('./models')
const UserRouter = require('./routers/UserRouter')
const errorHandler = require('./middlewares/ErrorHandler')
require('dotenv').config()
const cors = require('cors')

class Server {
    constructor() {
        this.host = process.env.HOST
        this.port = process.env.PORT
        this.app = express()
    }

    async start() {
        try {
            await sequelize.authenticate()
            console.log('Connection to the database has been established successfully.')
            await sequelize.sync({ alter: true,  logging: false})
            console.log('Database synchronized.')

            this.app.use(cors())
            this.app.use(express.json())
            this.app.use(express.urlencoded({ extended: true }))

            this.app.get('/', (req, res, next) => {
                res.send('<h1>Placeholder</h1>')
            });

            this.app.use('/api/users', new UserRouter().start())
            this.app.use(errorHandler)

            this.server = this.app.listen(this.port, () =>
                console.log(`Express server listening at: ${this.host}:${this.port}`)
            );

            this.server.on('error', (error) =>
                console.log(`Server Error: \n ${error.message}`)
            );
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }

        return this.app;
    }
}

new Server().start();
