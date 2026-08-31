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
 * Function to trap focus within the main element of the document
 */
function trapFocus() {
  let focusableElements;
  let firstFocusableElement;
  let lastFocusableElement;

  // Get all focusable elements on the page
  focusableElements = document.querySelectorAll('a, button, input, select, textarea');

  // Set the first and last focusable elements
  firstFocusableElement = focusableElements[0];
  lastFocusableElement = focusableElements[focusableElements.length - 1];

  // Trap the focus within the focusable elements
  document.onkeydown = function(e) {
    let isTabPressed = e.key === 'Tab' || e.keyCode === 9;

    if (!isTabPressed) {
      return;
    }

    if (e.shiftKey) /* shift + tab */ {
      if (document.activeElement === firstFocusableElement) {
        lastFocusableElement.focus();
        e.preventDefault();
      }
    } else /* tab */ {
      if (document.activeElement === lastFocusableElement) {
        firstFocusableElement.focus();
        e.preventDefault();
      }
    }
  };
}

// Export functions for testing
module.exports = {
  createServer,
  startApp,
  config,
  trapFocus
};

// Start the application if run directly
if (require.main === module) {
  startApp();
  // Call the trapFocus function to enable the focus trap
  trapFocus();
}