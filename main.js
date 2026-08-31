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
 * Creates an in-page button configuration object.
 * @param {Object} options - Button options
 * @param {string} options.id - Unique identifier for the button
 * @param {string} options.label - Text label displayed on the button
 * @param {string} [options.className='in-page-button'] - CSS class for styling
 * @param {Function} [options.onClick] - Click event handler
 * @returns {Object} The button configuration object
 */
function createInPageButton(options) {
  if (!options || typeof options !== 'object') {
    throw new TypeError('Options object is required');
  }
  if (!options.id || typeof options.id !== 'string') {
    throw new TypeError('Button id is required and must be a string');
  }
  if (!options.label || typeof options.label !== 'string') {
    throw new TypeError('Button label is required and must be a string');
  }

  return {
    id: options.id,
    label: options.label,
    className: options.className || 'in-page-button',
    type: 'button',
    onClick: typeof options.onClick === 'function' ? options.onClick : null,
    render() {
      return {
        tag: 'button',
        id: this.id,
        className: this.className,
        textContent: this.label,
        type: this.type
      };
    }
  };
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
  createInPageButton,
  config
};

// Start the application if run directly
if (require.main === module) {
  startApp();
}