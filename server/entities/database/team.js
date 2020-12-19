const sequelize = require('sequelize');
const connection = require('./connection');
const Model = sequelize.Model;
const dataTypes = sequelize.DataTypes;

class Team extends Model {}

Team.init({
  name: {
    type: dataTypes.STRING(45),
    allowNull: false
  },
  project_name:{
    type: dataTypes.STRING(45),
    allowNull: false
  }
}, {
  sequelize: connection,
  modelName: 'Team'
});

module.exports = Team;
