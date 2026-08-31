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
 * Function to render dependency graphs
 * @returns {String} HTML content of the dependency graph
 */
function renderDependencyGraph() {
  // Implementation to render dependency graph
  // Placeholder implementation:
  return '<div>Dependency Graph HTML Content</div>';
}

// Export functions for testing
module.exports = {
  createServer,
  startApp,
  config,
  renderDependencyGraph
};

// Start the application if run directly
if (require.main === module) {
  startApp();
}