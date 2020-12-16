const fs = require('fs');
const path = require('path');
const settings = JSON.parse(fs.readFileSync(path.resolve('appsettings.json')));

module.exports = settings;