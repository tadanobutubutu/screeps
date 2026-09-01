const http = require('http');
const path = require('path');

// TODO: This is the existing code that needs to be preserved

// Application configuration
const config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development'
};

/**
 * Validates if the landmark is valid
 * @param {string} landmark - The landmark to validate
 * @returns {boolean} - Returns true if the landmark is valid, otherwise false
 */
function validateLandmark(landmark) {
  // Implement validation logic here, for example:
  return landmark && landmark.trim().length > 0;
}

/**
 * Generates a unique ID for a landmark if it does not have one
 * @param {string} landmark - The landmark to process
 * @returns {string} The unique ID for the landmark
 */
function generateUniqueId(landmark) {
  let uniqueId = landmark;
  let counter = 0;
  while (document.getElementById(uniqueId)) {
    uniqueId = `${landmark}-${counter++}`;
  }
  return uniqueId;
}

/**
 * Ensures that all landmark elements have unique ids
 */
function ensureUniqueIds() {
  const landmarks = document.querySelectorAll('[role="landmark"]');
  landmarks.forEach(landmark => {
    if (!landmark.id) {
      landmark.id = generateUniqueId(landmark.textContent);
    }
  });
}

/**
 * Sets the proper ARIA role for the dependencyGraph container
 */
function setDependencyGraphRole() {
  const dependencyGraph = document.getElementById('dependencyGraph');
  if (dependencyGraph) {
    dependencyGraph.setAttribute('role', 'application');
  }
}

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
    setDependencyGraphRole();
    ensureUniqueIds();
  });
  return server;
}

// Export functions for testing
module.exports = {
  createServer,
  startApp,
  config,
  validateLandmark, // Export the new function
  generateUniqueId,
  ensureUniqueIds,
  setDependencyGraphRole
};

// Start the application if run directly
if (require.main === module) {
  startApp();
}