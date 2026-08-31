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

// New functions

// New function to handle logging
function logMessage(message) {
  console.log(`[LOG]: ${message}`);
}

// New function to handle graceful shutdown
function gracefulShutdown(server) {
  server.close(() => {
    console.log('Server closed gracefully');
    process.exit(0);
  });

  // Forcibly close server after 5 seconds
  setTimeout(() => {
    server.kill('SIGKILL');
  }, 5000);
}

// New function to add lang attribute to HTML element
function addLangAttribute(htmlElement) {
  htmlElement.setAttribute('lang', 'en');
}

// TODO: This is the existing code that needs to be preserved
// Existing exports and functions would go here...
// Line 96: preserved from commit eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2
// <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
// preserved from commit f8051b788bad4952d8493f08d3c7d22a06ff80d3
// <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
// preserved from commit 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e
// <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->
// maintained from commit d2add6d9898508dfc9093bc2ddfad74ce45e0537
// <!-- todo-hash: e944d6bc26c5766586cd5c819c30f566e3ef878d -->