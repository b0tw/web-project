const express = require('express');
const fs = require('fs');
const settings = JSON.parse(fs.readFileSync('appsettings.json')); 
const logger = require('morgan');

const app = express();

// Setup logger.
app.use(logger('dev'));

app.listen(settings.port, () => console.log(`Listening on port ${settings.port}...`));
