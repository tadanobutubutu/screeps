/**
 * Main application entry point
 */

// Import required modules
const http = require('http');
const path = require('path');

// TODO: This is the existing code that needs to be preserved
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// main.js - Main application entry point

// New Function required for the issue
function newFunction() {
  // Add your implementation here
}

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

// TODO: Implement this function for checking landmark elements
function checkLandmarkElements() {
  // Returns true if at least one element with class 'landmark' exists in the document
  return !!document.querySelector('.landmark');
}

// Export functions for testing
module.exports = {
  createServer,
  startApp,
  config,
  checkLandmarkElements
};

// New function added as per the issue
function newFunction() {
  // Placeholder for the new function logic
}

// Export the new function
module.exports.newFunction = newFunction;

// Start the application if run directly
if (require.main === module) {
  startApp();
}

// TODO: Add the new functionalities here if required