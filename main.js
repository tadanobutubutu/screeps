/**
 * Main application entry point
 */

// Import required modules
const http = require('http');
const path = require('path');
const fs = require('fs');

// TODO: This is the existing code that needs to be preserved

// Application configuration
const config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development'
};

/**
 * Loads configuration from a JSON file.
 * @param {string} filePath - Path to the JSON config file.
 * @returns {Object} Parsed configuration object.
 */
function loadConfigFromFile(filePath) {
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
}

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
  loadConfigFromFile
};

// Start the application if run directly
if (require.main === module) {
  startApp();
}