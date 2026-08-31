/**
 * Main application entry point
 */

// Import required modules
const http = require('http');
const path = require('path');

// TODO: Add the implementation of the requested function
function calculateSum(a, b) {
  return a + b;
}

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

// Export functions for testing
module.exports = {
  createServer,
  startApp,
  config,
  // Add the new export for calculateSum function
  calculateSum
};

// Start the application if run directly
if (require.main === module) {
  startApp();
}