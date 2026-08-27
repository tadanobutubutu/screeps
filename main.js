const config = require('./config');
const { initializeApp } = require('./utils');

console.log('Application starting...');

// Initialize the application
const app = initializeApp(config);

// TODO: Add implementation details

// Export the app instance
module.exports = { app };