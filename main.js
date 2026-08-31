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

// Address accessibility issues from insight report:
// - NEW: Add aria-label to elements as necessary
function addAriaLabel(element) {
  element.setAttribute('aria-label', 'Accessible name for element');
}

// - NEW: Ensure element has an id
function ensureElementHasId(element) {
  if (!element.id) {
    element.id = `unique-id-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Example usage of the new functions
// Assuming there is an HTML element with id 'myElement' that needs aria-label and id
const myElement = document.getElementById('myElement');
addAriaLabel(myElement);
ensureElementHasId(myElement);