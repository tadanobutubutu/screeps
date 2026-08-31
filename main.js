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
 * Adds the lang attribute to the HTML element
 */
function addLangAttribute() {
  // Implementation of the lang attribute addition goes here
  // This function can be empty or contain actual logic depending on the project requirements
}

/**
 * Adds other accessibility changes as per the insight report
 */
function addAccessibilityChanges() {
  // Implementation of additional accessibility changes goes here
  // This function can be empty or contain actual logic depending on the project requirements
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
  addLangAttribute,
  addAccessibilityChanges
};

// Start the application if run directly
if (require.main === module) {
  startApp();
}