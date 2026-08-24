// Exporting common utilities and configuration
module.exports = {
  // Main application entry point
  app: require('./app'),
  
  // Configuration
  config: require('./config'),
  
  // Utility functions
  utils: require('./utils'),
};

// Named exports for individual modules
module.exports.hello = require('./hello');
module.exports.User = require('./models/User');
module.exports.validateInput = require('./validateInput');