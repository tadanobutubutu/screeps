/**
 * Main application entry point
 */

// Import required modules
const http = require('http');
const path = require('path');
const { JSDOM } = require('jsdom');

// TODO: This is the existing code that needs to be preserved

// Application configuration
const config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development'
};

/**
 * Creates a lightweight web page with proper accessibility ARIA roles
 * @returns {Promise<Document>} A DOM Document
 */
function createAccessiblePage() {
  const dom = new JSDOM('<!doctype html><html lang="en"><body></body></html>', {
    runScripts: 'dangerously',
    resources: 'usable',
  });
  const { window } = dom;
  const body = window.document.body;
  const dependencyGraphContainer = document.createElement('div');
  dependencyGraphContainer.setAttribute('id', 'dependency-graph');
  dependencyGraphContainer.setAttribute('aria-labelledby', 'dependency-graph-label');
  dependencyGraphContainer.setAttribute('aria-describedby', 'dependency-graph-description');

  // Replace the body element with the new accessibility-enabled container
  body.replaceWith(dependencyGraphContainer);

  return dom.window.document;
}

/**
 * Creates and starts the HTTP server, but first creates an accessible web page
 * @returns {http.Server} The created server instance
 */
async function createServer() {
  const accessiblePage = await createAccessiblePage();

  // Other existing code for creating server, responses, and listening
  // ...
}

// Export functions for testing
module.exports = {
  createServer,
  startApp,
  config
};

// Start the application if run directly
if (require.main === module) {
  createServer();
}