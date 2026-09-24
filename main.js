/**
 * Main application entry point
 */

// Import required modules
const http = require('http');
const path = require('path');

// TODO: No additional changes requested at this time

// Application configuration
const config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development'
};

// Store the server instance for export
let server = null;

/**
 * Creates and starts the HTTP server
 * @returns {http.Server} The created server instance
 */
function createServer() {
  server = http.createServer((req, res) => {
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

// TODO: Add the implementation of this function
function newFunction() {
  // TODO: Define the implementation details of newFunction
  console.log('New function has been called.');
  return { status: 'New function executed successfully' };
}

// Export functions for testing
module.exports = {
  createServer,
  startApp,
  config,
  newFunction // Export the new function
};

// New function implementation as per the issue requirements
function newFunction() {
  // TODO: Implement the new function as per the issue requirements
  // Example placeholder return value
  return { message: "New function executed" };
}

// Export the new function for testing
module.exports.newFunction = newFunction;

// Start the application if run directly
if (require.main === module) {
  startApp();
}