const sequelize = require('sequelize');
const connection = require('./connection');
const Model = sequelize.Model;
const dataTypes = sequelize.DataTypes;

class Project extends Model {}

Project.init({
  name: {
    type: dataTypes.STRING(45),
    allowNull: false
  },
}, {
  sequelize: connection,
  modelName: 'Project'
});

module.exports = Project;
