const sequelize = require('sequelize');
const connection = require('./connection');
const Model = sequelize.Model;
const dataTypes = sequelize.DataTypes;

class Jury extends Model{}

Jury.init({
    project_id: {
        type: dataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    user_id: {
        type: dataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    grade: {
        type: dataTypes.FLOAT,
    
    },
    date_graded: {
        type: dataTypes.DATE
    },
},
    { sequelize: connection,
    modelName: 'Juries'
});

module.exports = Jury;
