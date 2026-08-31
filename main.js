/**
 * Main application entry point
 */

// Import required modules
const http = require('http');
const path = require('path');

// Application configuration
const config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development'
};

// Store credentials received from the response
let storedCredentials = null;

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

// New function to handle logging
function logMessage(message) {
  console.log(`[LOG]: ${message}`);
}

// New function to handle graceful shutdown
function handleGracefulShutdown(server) {
  server.close(() => {
    console.log('Server closed gracefully');
    process.exit(0);
  });

  // Forcibly close server after 5 seconds
  setTimeout(() => {
    console.error('Forcibly closing server after timeout');
    process.exit(1);
  }, 5000);
}

// New function to add lang attribute to HTML element
function addLangAttribute(element, lang) {
  element.setAttribute('lang', lang);
}

// TODO: Implement the logic to handle the credential response
function handleCredentialResponse(response) {
  // Accept a JSON string or an already parsed object
  let data;
  if (typeof response === 'string') {
    try {
      data = JSON.parse(response);
    } catch (e) {
      console.error('[ERROR] Failed to parse credential response JSON:', e);
      return;
    }
  } else if (typeof response === 'object') {
    data = response;
  } else {
    console.error('[ERROR] Credential response must be a string or object');
    return;
  }

  // Basic validation – ensure required fields exist and have correct types
  if (!data || typeof data.token !== 'string' || typeof data.expiration !== 'number') {
    console.error('[ERROR] Credential response is missing required fields (token, expiration)');
    return;
  }

  // Store the validated credentials
  storedCredentials = data;
  logMessage('Credential response received, parsed, validated and stored');
}

// Helper to retrieve stored credentials (useful for tests)
function getStoredCredentials() {
  return storedCredentials;
}

// Add accessibility function to handle the lang attribute for the entire HTML document
function handleAddLangAttribute(htmlDocument, lang) {
  // Get the html element and call addLangAttribute
  const htmlElement = htmlDocument.documentElement;
  addLangAttribute(htmlElement, lang);
}

// Export functions for testing
module.exports = {
  createServer,
  startApp,
  config,
  handleCredentialResponse,
  getStoredCredentials,
  handleAddLangAttribute
};