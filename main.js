// Main module exports
const utils = require('./utils');
const config = require('./config');
const helper = require('./helper');

// Commonly used utility functions
function formatData(data) {
  return JSON.stringify(data, null, 2);
}

function parseResponse(response) {
  try {
    return JSON.parse(response);
  } catch (error) {
    return { error: 'Invalid JSON response' };
  }
}

// Export all necessary modules and functions
module.exports = {
  utils,
  config,
  helper,
  formatData,
  parseResponse
};