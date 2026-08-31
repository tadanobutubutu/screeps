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

// Export functions for testing
module.exports = {
  createServer,
  startApp,
  config
};

// Start the application if run directly
if (require.main === module) {
  startApp();
}

// New function to handle logging
function logMessage(message) {
  console.log(`[LOG]: ${message}`);
}

// New function to handle graceful shutdown
function gracefulShutdown(server) {
  server.close(() => {
    console.log('Server closed gracefully');
    process.exit(0);
  });

  // Forcibly close server after 5 seconds
  setTimeout(() => {
    server.kill('SIGKILL');
  }, 5000);
}