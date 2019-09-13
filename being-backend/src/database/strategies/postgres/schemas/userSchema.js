const Sequelize = require('sequelize')

const UserSchema = {
    name: 'users',
    schema: {
        id: {
            type: Sequelize.INTEGER,
            required: true,
            primaryKey: true,
            autoIncrement: true
        },
        userrole: {
            type: Sequelize.STRING,
            required: true
        },
        name: {
            type: Sequelize.STRING,
            required: true
        },
        email: {
            type: Sequelize.STRING,
            unique: true,
            required: true
        },
        password: {
            type: Sequelize.STRING,
            required: true
        },
    },
    options: {
        tableName: 'users',
        freezeTableName: false,
        timestamps: false
    }
}

module.exports = UserSchema