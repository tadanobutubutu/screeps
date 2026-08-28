// Import required module(s) - for fixing table structure issues
const { formatTable, validateTableStructure } = require('./tableUtils');

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

function formatTableData(data, options) {
  return formatTable(data, options);
}

function validateTable(data) {
  return validateTableStructure(data);
}

module.exports = {
  VERSION,
  CONFIG,
  initialize,
  getConfig,
  getVersion,
  formatTableData,
  validateTable
};

module.exports.default = {
  VERSION,
  CONFIG,
  initialize,
  getConfig,
  getVersion,
  formatTableData,
  validateTable
};