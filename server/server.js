const express = require('express');
const settings = require('./entities/settings');
const logger = require('morgan');
const cors = require('cors');

const context = require('./entities/database/context');
const router = require('./routers')
const exceptionHandler = require('./middleware/exception-handling-middleware');
const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
};

const app = express();

context.connection.authenticate().then(() => {
  console.log('Successfully connected to the database...');
  
  app.use(cors(corsOptions));
  app.use(logger('dev'));
  app.use(express.json());
  app.use('/api', router);
  app.use(exceptionHandler());

  app.listen(settings.port, () => console.log(`Listening on port ${settings.port}...`));
}).catch(error => console.error('Unable to connect to the database:', error));
