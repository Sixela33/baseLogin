const UserService = require('../services/UserService');

class UserController {
    constructor() {
        this.service = new UserService()
    }

    createUser = async (req, res, next) => {
        try {
            const { name, email, role, password } = req.body;
            const response = await this.service.createUser(name, email, role, password)
            res.json(response)
        } catch (error) {
            next(error)
        }
    }

    logIn = async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const { accessToken, refreshToken } = await this.service.logIn(email, password)
            res.json({ accessToken, refreshToken });
        } catch (error) {
            next(error)
        }
    }

    refreshToken = async (req, res, next) => {
        try {
            const { token } = req.body;
            const { accessToken } = await this.service.refreshToken(token)
            res.json({ accessToken })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = UserController;
