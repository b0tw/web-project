const sequelize = require('sequelize');
const connection = require('./connection');
const Model = sequelize.Model;
const dataTypes = sequelize.DataTypes;

class Jury extends Model{}

Jury.init({
    grade: {
        type: dataTypes.FLOAT
    },
    date_graded: {
        type: dataTypes.DATE
    },
},
    { sequelize: connection,
    modelName: 'Juries'
});

module.exports = Jury;
