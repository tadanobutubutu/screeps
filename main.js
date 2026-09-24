/**
 * Main application entry point
 */

// Import required modules
const http = require('http');
const path = require('path');

// Application configuration
const config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development'
};

// Store the server instance for export
let server = null;

/**
 * Creates and starts the HTTP server
 * @returns {http.Server} The created server instance
 */
function createServer() {
  server = http.createServer((req, res) => {
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
 * Gets the server instance
 * @returns {http.Server|null} The server instance
 */
function getServer() {
  return server;
}

// Export functions for testing
module.exports = {
  createServer,
  startApp,
  getServer,
  config
};

// New functions

// New function to handle logging
function logMessage(message) {
  console.log(`[LOG]: ${message}`);
}

// TODO: Address accessibility issues from insight report:
// Example: Add 'aria-live' attribute to console log output for screen readers
function logWithAccessibility(message) {
  const accessibilityLog = document.createElement('div');
  accessibilityLog.setAttribute('aria-live', 'polite');
  accessibilityLog.textContent = message;
  document.body.appendChild(accessibilityLog);
}

// New function to add lang attribute to HTML element
function addLangAttribute(htmlElement) {
  htmlElement.setAttribute('lang', 'en');
}

// TODO: Any additional changes requested in the issue should be added after this function