/**
 * Main application entry point
 */

// Import required modules
const http = require('http');
const path = require('path');

// TODO: This is the existing code that needs to be preserved
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// Original logic preserved from commit dbc62f0d7ea6e8ed531f9712000039619b9f3d51

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
 * Stops the application server
 * @param {http.Server} server - The server instance to stop
 * @param {Function} [callback] - Optional callback to execute after server is closed
 * @returns {http.Server} The stopped server instance
 */
function stopApp(server, callback) {
  if (!server) {
    throw new Error('A server instance is required to stop the application');
  }
  server.close(() => {
    if (typeof callback === 'function') {
      callback();
    }
  });
  return server;
}

/**
 * Handles health check requests
 * @param {http.IncomingMessage} req - The incoming request object
 * @param {http.ServerResponse} res - The server response object
 * @returns {void}
 */
function handleHealthCheck(req, res) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'healthy', timestamp: new Date().toISOString() }));
}

/**
 * Restarts the application
 * @param {http.Server} server - The current server instance
 * @returns {http.Server} A new server instance
 */
function restartApp(server) {
  if (server) {
    server.close();
  }
  return startApp();
}

// Export functions for testing
module.exports = {
  createServer,
  startApp,
  stopApp,
  handleHealthCheck,
  restartApp,
  config
};

// Start the application if run directly
if (require.main === module) {
  startApp();
}