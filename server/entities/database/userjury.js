const sequelize = require('sequelize');
const connection = require('./connection');
const Model = sequelize.Model;
const dataTypes = sequelize.DataTypes;

class UserJury extends Model { }

UserJury.init({
    grade: {
        type: dataTypes.FLOAT
    }
}, {
    sequelize: connection,
    modelName: 'UserJury'
})

module.exports = UserJury