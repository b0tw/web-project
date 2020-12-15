const sequelize = require('sequelize');
const connection = require('./connection');
const Model = sequelize.Model;
const dataTypes = sequelize.DataTypes;

class Project extends Model {}

Project.init({
  id: {
    type: dataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: dataTypes.STRING(45),
    allowNull: false
  },
}, {
  sequelize: connection,
  modelName: 'Project'
});

module.exports = Project;
