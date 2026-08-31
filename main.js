/**
 * Main application entry point
 */

// Import required modules
const http = require('http');
const path = require('path');
const crypto = require('crypto-js'); // Importing the new required module

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
 * New function to hash data using SHA256 with crypto-js
 * @param {string} data - The data to hash
 * @returns {string} A Base64-encoded SHA256 hash value
 */
function hashData(data) {
  const hash = crypto.SHA256(data).toString(crypto.enc.Base64);
  return hash;
}

// Export functions for testing
module.exports = {
  createServer,
  startApp,
  config,
  hashData // Exporting the new function
};

// Start the application if run directly
if (require.main === module) {
  startApp();
}