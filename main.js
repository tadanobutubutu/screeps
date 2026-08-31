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
 * Gets the language attribute value for the HTML element
 * @returns {string} The language attribute value (e.g., 'en', 'en-US')
 */
function getLangAttribute() {
  // Default to 'en' for English if not specified
  return process.env.LANG_ATTRIBUTE || 'en';
}

/**
 * Creates an accessible in-page button element
 * @param {string} text - The button text content
 * @param {string} [id] - Optional button ID
 * @param {string} [className] - Optional CSS class name
 * @returns {object} Button configuration object with accessibility support
 */
function createInPageButton(text, id, className) {
  return {
    tag: 'button',
    text: text,
    id: id || null,
    className: className || 'in-page-button',
    attributes: {
      type: 'button',
      lang: getLangAttribute(),
      'aria-label': text
    }
  };
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