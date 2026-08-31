/**
 * Main application entry point
 */

// Import required modules
const http = require('http');
const path = require('path');

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
 * The new function that should be added without paths overwriting and preserving the existing export structure
 */
function newFunction() {
  // Your implementation goes here
}

/**
 * Export functions for testing
 */
module.exports = {
  createServer,
  startApp,
  config,
  // Add your new export if needed
  // e.g., module.exports.newFunction = newFunction;
};

// Export the new function directly for easier testing. This step is optional and can be removed if you prefer not to export it this way.
exports.newFunction = newFunction;

// Start the application if run directly
if (require.main === module) {
  startApp();
}