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

// Accessibility-related changes
function getAccessibleServerUrl(serverUrl) {
  // Implement ARIA-compatible URL handling, if necessary
  // On production, hide #hash symbol or set a valid ARIA attribute for the hash
  const accessibleUrl = serverUrl.replace(/#/g, ''); // Replace '#' with empty string as a simple example
  return accessibleUrl;
}

/**
 * Starts the application and returns the server URL with accessibility improvements
 * @returns {string} The server URL with accessibility improvements
 */
async function startAccessibleApp() {
  const server = createServer();
  const accessibleServerUrl = getAccessibleServerUrl(`http://localhost:${config.port}`);
  server.listen(config.port, () => {
    console.log(`Server running on port ${config.port}: ${accessibleServerUrl}`);
    return accessibleServerUrl;
  });
}

/**
 * Export functions for testing, including the new accessible functions
 */
module.exports = {
  createServer,
  startApp,
  startAccessibleApp, // New accessible function
  config,
  getAccessibleServerUrl // New accessible function
};

// Start the application if run directly
if (require.main === module) {
  startAccessibleApp(); // Use the new accessible function
}