const {Model} = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {}
    }

    User.init({
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        role: DataTypes.STRING,
        password: DataTypes.STRING,
        refreshToken: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'User'
    })

    return User
}