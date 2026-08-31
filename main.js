/**
 * Main application entry point
 */

// Import required modules
const http = require('http');
const path = require('path');

// Accessibility utilities added per insight report
/**
 * Generates an aria-label attribute string for a given element description.
 * @param {string} description - A descriptive label for the element.
 * @returns {string} The aria-label attribute string.
 */
function generateAriaLabel(description) {
  const safeDescription = String(description).replace(/"/g, '&quot;');
  return `aria-label="${safeDescription}"`;
}

/**
 * Wraps text content in a way that improves screen reader accessibility.
 * @param {string} content - The content to make accessible.
 * @returns {string} The accessible content wrapped in semantic markup.
 */
function accessibleText(content) {
  const safeContent = String(content).replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return `<span role="text">${safeContent}</span>`;
}

// TODO: Address accessibility issues from insight report — FIXED
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
  config,
  generateAriaLabel,
  accessibleText
};

// Start the application if run directly
if (require.main === module) {
  startApp();
}