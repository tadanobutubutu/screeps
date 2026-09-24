/**
 * Main application entry point
 */

// Import required modules
const http = require('http');
const path = require('path');

// Import content modules
const { dependencyGraphContent } = require('./dependencyGraphContent');
const { indexContent } = require('./indexContent');

functions.forEach(functionToSave => {
  window[functionToSave] = window[functionToSave] || module.exports[functionToSave];
});

// Application configuration
const config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  // Adding lang attribute based on content
  lang: getLangAttribute()
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
 * Renders the dependency graph view
 * @returns {string} Rendered dependency graph content
 */
function renderDependencyGraph() {
  return dependencyGraphContent();
}

/**
 * Renders the index view
 * @returns {string} Rendered index content
 */
function renderIndex() {
  return indexContent();
}

// Export functions for testing
module.exports = {
  createServer,
  startApp,
  config,
  handleCredentialResponse,
  getStoredCredentials,
  handleAddLangAttribute,
  newFunctionality,
  renderDependencyGraph,
  renderIndex,
  countDependencies,
  addressAccessibilityIssues,
  generateAccessibilityReport,
  calculateAccessibilityScore,
  ensureUniqueLandmarksFromString,
  validateLandmark
};