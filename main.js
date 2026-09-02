// main.js - Main application entry point

// Main module

// Dependency imports
const dependencyGraphContent = require('./dependencyGraphContent').dependencyGraphContent;
const indexContent = require('./indexContent').indexContent;
const http = require('http');
const url = require('url');
const a11yStore = require('./utilities/a11yStore');

const {
  add,
  subtract,
  multiply,
  divide,
  power,
  squareRoot,
  factorial,
  fibonacci,
  sum,
  average,
  max,
  min,
  mode,
  median,
} = require('./mathHelpers');

// Existing rendering functions (preserving existing exports and functions)

function greetingFunction() {
  return "Hello, World!";
}

// TODO: Update the existing function using the new functions for rendering graph/index
// DO NOT REMOVE OR RENAME THE EXISTING FUNCTIONS BELOW

const renderGraphIndex = (graphData) => {
  // Address accessibility issues from insight report
  ensureDependencyGraphAccessibility(document.querySelector('.dependency-graph-container'));
  renderDependencyGraphs(graphData);
};

// Required function implementations

/**
 * Rendering dependency graphs with accessibility enhancements
 * @param {Object} graphData - Data for rendering dependency graphs
 */
function renderDependencyGraphs(graphData) {
  if (typeof document === 'undefined') return;

  // Remove any existing graph containers
  const existingContainers = document.querySelectorAll('.dependency-graph-container');
  existingContainers.forEach(container => container.remove());

  // Create new container
  const container = document.createElement('div');
  container.className = 'dependency-graph-container';
  container.setAttribute('role', 'region');

  // Render the graph
  const graphHtml = renderDependencyGraph(graphData);
  container.innerHTML = graphHtml;

  // Add to document
  const mainElement = document.querySelector('main') || document.body;
  mainElement.appendChild(container);
}

// New functions
function ensureInteractiveElementsAccessible() {
  a11yStore.ensureInteractiveRoles();
  a11yStore.addFormControlLabels();
  a11yStore.ensureImageAccessibility();
}

// Function to handle initial accessibility setup
function handleInitialAccessibility() {
  a11yStore.checkLandmarkElements();
  a11yStore.addSVGAccessibilityProps();
  a11yStore.fixFakeLinks();
  a11yStore.updateLiveRegion('Initial accessibility enhancements applied');
  // Fix table structure issues
  const tables = document.querySelectorAll('table');
  tables.forEach(fixTableStructure);
  ensureInteractiveElementsAccessible();
}

// HTTP Server setup
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  // CORS headers for credential responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
  }

  // Health check endpoint
  if (parsedUrl.pathname === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', sessions: getActiveSessionsCount() }));
      return;
  }

  // Credential response endpoint
  if (parsedUrl.pathname === '/api/credential' && req.method === 'POST') {
      let body = '';

      req.on('data', chunk => {
          body += chunk.toString();
      });

      req.on('end', () => {
          try {
              const credentialResponse = JSON.parse(body);
              const result = handleCredentialResponse(credentialResponse);
              res.writeHead(result.status === 'success' ? 200 : 400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(result));
          } catch (error) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ status: 'error', message: 'Invalid JSON' }));
          }
      });
      return;
  }

  // Session validation endpoint
  if (parsedUrl.pathname === '/api/session/validate' && req.method === 'GET') {
      const sessionId = parsedUrl.query.sessionId;

      if (!sessionId) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ status: 'error', message: 'Session ID required' }));
          return;
      }

      const session = validateSession(sessionId);

      if (session) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ status: 'valid', user: session }));
      } else {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ status: 'invalid', message: 'Session expired or invalid' }));
      }
      return;
  }

  // Session revocation endpoint
  if (parsedUrl.pathname === '/api/session/revoke' && req.method === 'POST') {
      let body = '';

      req.on('data', chunk => {
          body += chunk.toString();
      });

      req.on('end', () => {
          try {
              const { sessionId } = JSON.parse(body);
              const revoked = revokeSession(sessionId);

              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ status: revoked ? 'success' : 'error' }));
          } catch (error) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ status: 'error', message: 'Invalid request' }));
          }
      });
      return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'error', message: 'Not found' }));
});

// Start server if this is the main module
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        handleInitialAccessibility();
    });
}

// Export modules for testing
module.exports = {
  renderDependencyGraph,
  renderIndex,
  ensureDependencyGraphAccessibility,
  validateSession,
  getActiveSessionsCount,
  server,
  sanitizeFilename,
  processData,
  revokeSession,
  handleCredentialResponse,
  parseCredentialResponse,
  decodeJwtToken,
  generateSessionId,
  validateTableStructure,
  validateTableAccessibility,
  validateLandmark,
  validateLandmarkStructure,
  createInPageButton,
  personName,
  handleInitialAccessibility
};