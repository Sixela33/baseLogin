import Jwt from 'jsonwebtoken';

// this middleware checks if the user has the permissions needed to access the route
class PermissionsMiddelware {
    constructor() {
        this.call = this.call.bind(this);
    }

    async call(req, res, next) {
        try {
            const token = req.header('Authorization');
            if (!token) {
                return res.status(403)
            }
            let decoded = null

            try {
                decoded = Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
            } catch (error) {
                throw { message: error.message, status: 403 }   
            }
    
            req.user = decoded
            next()
        } catch (error) {
            next(error)
        }
    
    }
}

module.exports = PermissionsMiddelware