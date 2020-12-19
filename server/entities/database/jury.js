const sequelize = require('sequelize');
const connection = require('./connection');
const Model = sequelize.Model;
const dataTypes = sequelize.DataTypes;

class Jury extends Model{}

Jury.init({
    total_grade: {
        type: dataTypes.FLOAT
    }
},
    { sequelize: connection,
    modelName: 'Juries'
});

module.exports = Jury;
