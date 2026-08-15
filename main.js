// Main application entry point
// Preserving existing application structure

const path = require('path');

// Base configuration
const config = {
  appName: 'RoomManager',
  version: '1.0.0',
  environment: process.env.NODE_ENV || 'development'
};

// Export configuration
module.exports = {
  config,
  entry: './src/index.js',
  managers: {
    room: require('./src/managers/roomManager.js')
  }
};