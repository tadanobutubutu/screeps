/**
 * Main application entry point
 */

// Import required modules
const http = require('http');
const path = require('path');

// TODO: This is the existing code that needs to be preserved

// New Function - Custom middleware example
function myCustomMiddleware(req, res, next) {
  console.log('Custom middleware being invoked');
  next();
}

// New Function - Simple API endpoint example
function getData(req, res) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ data: 'Hello, World!' }));
}

/**
 * Creates and starts the HTTP server with the new functions
 * @returns {http.Server} The created server instance
 */
function createServer() {
  const server = http.createServer((req, res) => {
    // Old server logic

    // New logic with custom middleware
    myCustomMiddleware(req, res, () => {
      // Old logic for handling the request
      getData(req, res);
    });
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
  myCustomMiddleware,
  getData,
  config
};

// Start the application if run directly (with new functions)
if (require.main === module) {
  startApp();
}