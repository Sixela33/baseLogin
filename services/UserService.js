const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const ACCESS_TOKEN_SECRET = "your_access_token_secret"; // Debe ser una clave secreta segura
const REFRESH_TOKEN_SECRET = "your_refresh_token_secret"; // Debe ser una clave secreta segura
const REFRESH_TOKEN_EXPIRATION = '7d'; // Tiempo de expiración de los refresh tokens
const ACCESS_TOKEN_EXPIRATION = '1h'; // Tiempo de expiración de los access tokens

class UserService {
    constructor() {}

    _generateAccessToken = (user) => {
        return jwt.sign({ id: user.id, email: user.email }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRATION });
    }

    _generateRefreshToken = (user) => {
        const refreshToken = jwt.sign({ id: user.id, email: user.email }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION });
        user.refreshToken = refreshToken;
        return refreshToken;
    }

    createUser = async (name, email, role, password) => {
        let old_user = await User.findOne({ where: { email: email } });

        if (old_user) {
            throw { message: "This email is already registered", status: 400 }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        let new_user = await User.create({ name, email, role, password: hashedPassword });
        
        const accessToken = this._generateAccessToken(new_user);
        const refreshToken = this._generateRefreshToken(new_user);

        return { new_user, accessToken, refreshToken };
    }

    logIn = async (email, password) => {
        let user = await User.findOne({ where: { email: email } });

        if (!user) {
            throw { message: "Invalid email or password", status: 400 };
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw { message: "Invalid email or password", status: 400 };
        }

        const accessToken = this._generateAccessToken(user);
        const refreshToken = this._generateRefreshToken(user);

        await user.save()

        return { accessToken, refreshToken };
    }

    refreshToken = async (token) => {
        if (!token) {
            throw { message: "Unauthorized", status: 401 };
        }

        const user = await User.findOne({ where: { refreshToken: token } });

        if (!user) {
            throw { message: "Invalid refresh token", status: 404 };
        }

        let payload = null;
        try {
            payload = jwt.verify(token, REFRESH_TOKEN_SECRET);
        } catch (error) {
            throw { message: error.message, status: 401 };
        }

        const accessToken = this._generateAccessToken(user);

        return { accessToken };
    }
}

module.exports = UserService;
