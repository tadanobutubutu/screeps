// TODO: Add back any required exports that might have been?
// (This comment remains as-is)

const VERSION = '1.0.0';

const CONFIG = {
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  env: process.env.NODE_ENV || 'development'
};

function initialize() {
  console.log('Application initialized');
  return true;
}

function getConfig() {
  return CONFIG;
}

function getVersion() {
  return VERSION;
}

module.exports = {
  VERSION,
  CONFIG,
  initialize,
  getConfig,
  getVersion
};

module.exports.default = {
  VERSION,
  CONFIG,
  initialize,
  getConfig,
  getVersion
};