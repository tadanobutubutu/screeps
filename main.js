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
 * Creates a web resource button suitable for accessibility
 * @param {string} url - The URL of the web resource
 * @param {string} text - The text content of the button
 * @returns {HTMLButtonElement} The created button element
 */
function createAccessibleWebResourceButton(url, text) {
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.setAttribute('aria-label', `Go to ${text}`);
  button.textContent = text;
  button.href = url;
  return button;
}

// Export functions for testing
module.exports = {
  createServer,
  startApp,
  config,
  createAccessibleWebResourceButton
};

// Start the application if run directly
if (require.main === module) {
  startApp();
}