const express = require('express');
const fs = require('fs');
const settings = JSON.parse(fs.readFileSync('appsettings.json'));
const logger = require('morgan');

const context = require('./entities/database/context');
<<<<<<< HEAD
=======

>>>>>>> 1ceb55bc24cd5a8fb1cc77d812020e30b5abc0d2
const router = require('./routers')

const app = express();

context.connection.authenticate().then(() => {
  console.log('Successfully connected to the database...');
  context.connection.sync();
  console.log('Database is up to date.');
<<<<<<< HEAD
  // Setup logger.
  app.use(logger('dev'));
  app.use(express.json())
=======
// Setup logger.
  app.use(logger('dev'));
  app.use(express.json());
>>>>>>> 1ceb55bc24cd5a8fb1cc77d812020e30b5abc0d2
  app.use('/api', router)
  app.listen(settings.port, () => console.log(`Listening on port ${settings.port}...`));
}).catch(error => console.error('Unable to connect to the database:', error));
