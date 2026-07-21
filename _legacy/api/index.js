const path = require('path');

// CRITICAL: Set the correct directory for static files
process.chdir(path.join(__dirname, '..'));

const app = require('../server');

module.exports = app;