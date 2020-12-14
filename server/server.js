const express = require('express');
const fs = require('fs');
const settings = JSON.parse(fs.readFileSync('appsettings.json'));
const logger = require('morgan');
const context = require('./entities/database/context');
const router = require('./routers')

const app = express();

<<<<<<< HEAD

=======
>>>>>>> Added the structure for the route
context.connection.authenticate().then(() => {
  console.log('Successfully connected to the database...');
  context.connection.sync();
  console.log('Database is up to date.');
  // Setup logger.
  app.use(logger('dev'));
  app.use(express.json())
  app.use('/api', router)
  app.listen(settings.port, () => console.log(`Listening on port ${settings.port}...`));
}).catch(error => console.error('Unable to connect to the database:', error));
