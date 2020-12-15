const sequelize = require('sequelize');
const connection = require('./connection');
const Model = sequelize.Model;
const dataTypes = sequelize.DataTypes;

class Deliverable extends Model {}

Deliverable.init({
  id: {
    type: dataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  title: {
    type: dataTypes.STRING(45),
    allowNull: false
  },
  description: {
    type: dataTypes.STRING,
  },
  url: {
    type: dataTypes.STRING,
  }
}, {
  sequelize: connection,
  modelName: 'Deliverable'
});

module.exports = Deliverable;
