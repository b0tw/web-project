const sequelize = require('sequelize');
const connection = require('./connection');
const Model = sequelize.Model;
const dataTypes = sequelize.DataTypes;

class Juries extends Model{}

Juries.init({
    ProjectId: {
        type: dataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    UserId: {
        type: dataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    Grade: {
        type: dataTypes.FLOAT,
    
    },
    Date_graded: {
        type: dataTypes.DATE
    },
},
    { sequelize: connection,
    modelName: 'Juries'
});

module.exports = Juries;
