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
 * Adds lang attribute to HTML element
 * @returns {string} The lang attribute value
 */
function getLangAttribute() {
  // Example implementation, replace with actual logic
  return 'en';
}

/**
 * Creates an in-page button element
 * @returns {HTMLButtonElement} The created button element
 */
function createInPageButton() {
  // Example implementation, replace with actual logic
  const button = document.createElement('button');
  button.textContent = 'Click me';
  return button;
}

// Export functions for testing
module.exports = {
  createServer,
  startApp,
  config,
  getLangAttribute,
  createInPageButton
};

// Start the application if run directly
if (require.main === module) {
  startApp();
}