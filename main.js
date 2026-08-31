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
 * Adds a lang attribute to the HTML element if it's not present
 */
function getLangAttribute() {
  // Assuming 'document' is available in the context
  if (!document.lang) {
    document.lang = 'en'; // Default to English if lang attribute is missing
  }
}

/**
 * Creates an in-page button element with the appropriate attributes
 */
function createInPageButton() {
  const button = document.createElement('button');
  button.textContent = 'Click me';
  button.setAttribute('lang', 'en'); // Ensure the button has the lang attribute
  document.body.appendChild(button);
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