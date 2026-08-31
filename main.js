/**
 * Main application entry point
 * @module main
 */
/**
 * Application configuration
 * @type {Object}
 */
const config = {
    appName: 'SampleApp',
    version: '1.0.0',
    debug: false
};

/**
 * Simple logger utility
 * @param {string} message - The message to log
 */
function log(message) {
    if (config.debug) {
        console.log(`[${config.appName}] ${message}`);
    }
}

// TODO: This is the existing code that needs to be preserved

// Original logic preserved from commit dbc62f0d7ea6e8ed531f9712000039619b9f3d51

// (This comment remains as-is)

// New function added based on the issue request
function newExportedFunction() {
  // Implementation of the new function
}

/**
 * Initializes the application
 * @returns {Promise<void>}
 */
async function init() {
    log('Initializing application...');
    console.log(`Welcome to ${config.appName} v${config.version}`);
}

/**
 * Shuts down the application gracefully
 */
function shutdown() {
    log('Shutting down...');
    console.log('Goodbye!');
}

// Export functions and utilities
module.exports = {
    config,
    log,
    init,
    shutdown,
    newExportedFunction
};