// main.js - Application entry point

const fs = require('fs');
const path = require('path');

// TODO: Add back any required exports that might have been removed

/**
 * Load configuration from file
 * @param {string} configPath - Path to config file
 * @returns {Object} Configuration object
 */
function loadConfig(configPath) {
  const absolutePath = path.resolve(configPath);
  const configData = fs.readFileSync(absolutePath, 'utf8');
  return JSON.parse(configData);
}

/**
 * Initialize the application
 * @param {Object} options - Initialization options
 * @returns {Object} Application instance
 */
function init(options = {}) {
  return {
    config: options.config || loadConfig('./config.json'),
    version: '1.0.0'
  };
}

// Export functions
module.exports = {
  loadConfig,
  init
};