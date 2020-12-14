const express = require('express');
const fs = require('fs');
const settings = JSON.parse(fs.readFileSync('appsettings.json')); 
const logger = require('morgan');
const router = require('./routers')

const app = express();

// Setup logger.
app.use(logger('dev'));
app.use(express.json());
app.use('/api', router)

app.listen(settings.port, () => console.log(`Listening on port ${settings.port}...`));
