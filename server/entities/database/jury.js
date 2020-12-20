const sequelize = require('sequelize');
const connection = require('./connection');
const Model = sequelize.Model;

class Jury extends Model{}

Jury.init({},
{ 
  sequelize: connection,
  modelName: 'Juries'
});

module.exports = Jury;
