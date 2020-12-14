const sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
const databaseSettings = JSON.parse(fs.readFileSync(path.resolve('appsettings.json')))
  .connections
  .database;

const connection = new sequelize.Sequelize(databaseSettings.name,
  databaseSettings.username,
  databaseSettings.password,
  {
    host: databaseSettings.host,
    dialect: databaseSettings.dialect
  });

module.exports = connection;
