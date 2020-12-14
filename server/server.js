const express = require('express');
const fs = require('fs');
const settings = JSON.parse(fs.readFileSync('appsettings.json'));
const logger = require('morgan');
const bodyParser = require('body-parser')
const router = require('./routers')

const app = express();

// Setup logger.
app.use(logger('dev'));

app.use(bodyParser.json())
app.use('/api', router)

app.listen(settings.port, () => console.log(`Listening on port ${settings.port}...`));
