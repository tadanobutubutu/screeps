/**
 * Main application entry point
 */

// Import required modules
const http = require('http');
const path = require('path');

// TODO: This is the existing code that needs to be preserved

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
 * Checks if the element with the given landmark identifier exists in the response
 * @param {http.ServerResponse} res - The HTTP server response object
 * @param {string} landmark - The landmark identifier to check for
 * @returns {boolean} True if the landmark element exists, false otherwise
 */
function checkLandmarkElement(res, landmark) {
  const responseBody = res._responseBody; // Assuming the response body is stored in res._responseBody
  return responseBody && responseBody.includes(landmark);
}

// Export functions for testing
module.exports = {
  createServer,
  startApp,
  config,
  checkLandmarkElement
};

// Start the application if run directly
if (require.main === module) {
  startApp();
}