/**
 * Main application entry point
 */

// Import required modules
const http = require('http');
const path = require('path');
const { getRandomInt } = require('./utils'); // Assuming there's a utils.js file containing the getRandomInt function

// TODO: This is the existing code that needs to be preserved

// Application configuration
const config = {
  env: process.env.NODE_ENV || 'development'
};

/**
 * Creates and starts the HTTP server
 * @returns {http.Server} The created server instance
 */
function createServer() {
  const serverPort = getRandomInt(3000, 3050);
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
  server.listen(serverPort, () => {
    console.log(`Server running on port ${serverPort}`);
  });
  return server;
}

// Export functions for testing
module.exports = {
  createServer,
  startApp,
  config
};

// Add the following line at the end of the file if you want to start the application if run directly
// if (require.main === module) {
//   startApp();
// }