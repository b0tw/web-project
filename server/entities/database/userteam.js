const sequelize = require('sequelize');
const connection = require('./connection');
const Model = sequelize.Model;

class UserTeam extends Model { }

UserTeam.init({}, {
    sequelize: connection,
    modelName: 'UserTeam'
})

module.exports = UserTeam