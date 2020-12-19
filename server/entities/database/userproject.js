const sequelize = require('sequelize');
const connection = require('./connection');
const Model = sequelize.Model;

class UserProject extends Model { }

UserProject.init({}, {
    sequelize: connection,
    modelName: 'UserProject'
})

module.exports = UserProject