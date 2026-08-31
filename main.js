/**
 * Main application entry point
 */

// Import required modules
const http = require('http');
const path = require('path');

// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)

// Application configuration
const config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development'
};

/**
 * Creates and starts the HTTP server
 * @returns {http.Server} The created server instance
 */
function createServer() {
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', config }));
  });
  return server;
}

/**
 * Starts the application
 */
function startApp() {
  const server = createServer();
  server.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
  return server;
}

/**
 * Adds a new function to the module
 * This is a placeholder for the new function added based on the issue
 * @param {Object} data - The data object to process
 * @returns {String} The processed data
 */
function processData(data) {
  // Placeholder for data processing logic
  return 'Processed data';
}

// Export functions for testing
module.exports = {
  createServer,
  startApp,
  config,
  processData // Added new export
};

// Start the application if run directly
if (require.main === module) {
  startApp();
}