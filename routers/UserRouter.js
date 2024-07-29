const { Router } = require("express");
const UserController = require("../controllers/UserController");

class UserRouter {
    constructor() {
        this.router = Router()
        this.controller = new UserController()
    }

    start () {

        this.router.post('/register', this.controller.createUser)
        this.router.post('/login', this.controller.logIn)
        this.router.get('/refresh', this.controller.refreshToken)

        return this.router
    }
}

module.exports = UserRouter