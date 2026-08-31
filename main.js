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
    // Add the following new function to simulate the server's behavior (for the proposed issue)
    if (req.url === '/api/example') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', message: 'This is an example response' }));
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', config }));
    }
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

// Export functions for testing and the new function for testing
module.exports = {
  createServer,
  startApp,
  config,
  // Add the new function to be tested
  handleRequest: function(req) {
    return new Promise(resolve => {
      const server = createServer();
      server.request(req, (res) => {
        resolve(res);
      });
    });
  }
};

// Start the application if run directly
if (require.main === module) {
  startApp();
}