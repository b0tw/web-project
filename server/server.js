const express = require('express');
const fs = require('fs');
const settings = JSON.parse(fs.readFileSync('appsettings.json'));
const logger = require('morgan');
<<<<<<< HEAD
const context = require('./entities/database/context');
<<<<<<< HEAD
=======
>>>>>>> Added the structure for the route
=======
>>>>>>> bd7b8a584fd942ca2466680b4f5ea9275754ccc0
const router = require('./routers')

const app = express();

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> bd7b8a584fd942ca2466680b4f5ea9275754ccc0
context.connection.authenticate().then(() => {
  console.log('Successfully connected to the database...');
  context.connection.sync();
  console.log('Database is up to date.');
  // Setup logger.
  app.use(logger('dev'));
=======
// Setup logger.
app.use(logger('dev'));
app.use(express.json());
app.use('/api', router)
>>>>>>> Added the structure for the route

  app.use(express.json())
  app.use('/api', router)

  app.listen(settings.port, () => console.log(`Listening on port ${settings.port}...`));
}).catch(error => console.error('Unable to connect to the database:', error));
