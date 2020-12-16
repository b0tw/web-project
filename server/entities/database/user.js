const sequelize = require('sequelize');
const connection = require('./connection');
const Model = sequelize.Model;
const dataTypes = sequelize.DataTypes;

class User extends Model {}

User.init({
  username: {
    type: dataTypes.STRING(45),
    allowNull: false
  },
  surname: {
    type: dataTypes.STRING(45),
    allowNull: false
  },
  name: {
    type: dataTypes.STRING(45),
    allowNull: false
  },
  password: {
    type: dataTypes.STRING(90),
    allowNull: false,
  },
  is_professor: {
    type: dataTypes.TINYINT,
    allowNull: false
  }
}, {
  sequelize: connection,
  modelName: 'User'
});

module.exports = User;
