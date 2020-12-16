const sequelize = require('sequelize');
const connection = require('./connection');
const Model = sequelize.Model;
const dataTypes = sequelize.DataTypes;

class Session extends Model {}

Session.init({
  token: {
    type: dataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize: connection,
  modelName: 'Session'
});

module.exports = Session;
