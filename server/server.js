const express = require('express');
const settings = require('./entities/settings');
const logger = require('morgan');
const context = require('./entities/database/context');

const app = express();
const router = require('./routers');

context.connection.authenticate().then(() =>
{
  console.log('Successfully connected to the database...');
  context.connection.sync();
  console.log('Database is up to date.');

  // Setup logger.
  app.use(logger('dev'));

  app.use(express.json())
  app.use('/api', router)

  app.listen(settings.port, () => console.log(`Listening on port ${settings.port}...`));
}).catch(error => console.error('Unable to connect to the database:', error));
