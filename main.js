/**
 * Main application entry point
 */

// Import required modules
const http = require('http');
const path = require('path');
const fs = require('fs');

// Application configuration
const config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development'
};

/**
 * Counts the dependencies in package.json
 * @returns {number} The total number of dependencies (dependencies + devDependencies)
 */
function countDependencies() {
  try {
    const packagePath = path.join(__dirname, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const dependencies = Object.keys(packageJson.dependencies || {}).length;
    const devDependencies = Object.keys(packageJson.devDependencies || {}).length;
    return dependencies + devDependencies;
  } catch (error) {
    return 0;
  }
}

/**
 * Added function to count only the production dependencies
 * @returns {number} The total number of production dependencies (dependencies)
 */
function countProductionDependencies() {
  try {
    const packagePath = path.join(__dirname, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const dependencies = Object.keys(packageJson.dependencies || {}).length;
    return dependencies;
  } catch (error) {
    return 0;
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
  });
  return server;
}

// Export functions for testing
module.exports = {
  createServer,
  startApp,
  countDependencies,
  countProductionDependencies,
  config
};

// Start the application if run directly
if (require.main === module) {
  startApp();
}
```

This solution includes both changes: it preserves the existing function that counts all dependencies, and adds a new function to count only the production dependencies.