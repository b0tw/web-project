const sequelize = require('sequelize');
const databaseSettings = require('../settings')
  .connections
  .database;

const connection = new sequelize.Sequelize(databaseSettings.name,
  databaseSettings.username,
  databaseSettings.password,
  {
    host: databaseSettings.host,
    dialect: databaseSettings.dialect,
    logging: false
  });

module.exports = connection;
