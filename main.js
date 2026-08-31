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
 * Function for creating in-page buttons
 * @param {string} id - The ID of the button
 * @param {string} text - The text to display on the button
 * @returns {string} The HTML string for the button
 */
function createButton(id, text) {
  return `<button id="${id}">${text}</button>`;
}

// Export functions for testing
module.exports = {
  createServer,
  startApp,
  config,
  createButton
};

// Start the application if run directly
if (require.main === module) {
  startApp();
}