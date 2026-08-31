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
  // Add the new function here
  function newFunction() {
    console.log("New function is called!");
  }
  return server;
}

/**
 * Adds a new route to the server
 * @param {http.Server} server The server instance
 * @param {string} path The route path
 * @param {function} handler The route handler function
 */
function addRoute(server, path, handler) {
  server.on('request', (req, res) => {
    if (req.url === path) {
      req.url = '/';
      require('./router').handleRequest(req, res);
      req.url = path;
      handler(req, res);
    } else {
      require('./router').handleRequest(req, res);
    }
  });
}

// Export functions for testing
module.exports = {
  createServer,
  startApp,
  config,
  addRoute // Add the new function to exports
};

// Start the application if run directly
if (require.main === module) {
  startApp();
}