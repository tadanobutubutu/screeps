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

// New function to address accessibility issues from the insight report
function ensureAccessibility(req, res, next) {
  // Implement accessibility checks here
  // For example, add headers for CORS, Content Security Policy, etc.
  // This is a placeholder for the actual implementation
  res.setHeader('Content-Security-Policy', "default-src 'self';");
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Frame-Options', 'DENY');
  next();
}

// Export functions for testing
module.exports = {
  createServer,
  startApp,
  config,
  ensureAccessibility
};

// Start the application if run directly
if (require.main === module) {
  startApp();
}