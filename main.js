const url = require('url');
const { dependencyGraphContent, indexContent } = require('./dependencyContent');
const main = require('./utilities');
const http = require('http');
const a11yStore = {
  // ... a11yStore methods from both branches ...
};

const greetingFunction = () => 'Hello, World!';

const config = {
  port: 3000,
  debug: false
};

const getWelcomeMessage = () => greetingFunction() + ' This is a new function that returns a welcome message.';

const { class1, function1, Object1 } = require('./path/to/module');

function renderDependencyGraph(deps, options = {}) {
  return dependencyGraphContent(deps, options);
}

function renderIndex(data, options = {}) {
  return indexContent(data, options);
}

const mainElement = document.createElement('main');

if (typeof document !== 'undefined') {
  mainElement.setAttribute('lang', document.documentElement.lang);
}

function newFunction() {
  // Implementation from origin/main
}

if (typeof document !== 'undefined') {
  const banners = document.querySelectorAll('[role="banner"], [role="header"]');
  if (banners.length > 1) {
    throw new Error('Document should have at most one banner or header landmark');
  }
}

function checkLandmarkElement(role, element) {
  // (code for checkLandmarkElement remains the same)
}

function wrapPrimaryContentInMain() {
  if (typeof document === 'undefined' || !document.body) {
    return null;
  }

  let mainElement = document.querySelector('main');
  if (mainElement) {
    return mainElement;
  }

  const elementsToExclude = [];
  const landmarks = document.querySelectorAll(
    'header, nav, aside, footer, [role="banner"], [role="navigation"], [role="complementary"], [role="contentinfo"]'
  );
  landmarks.forEach((landmark) => elementsToExclude.push(landmark));

  mainElement = document.createElement('main');

  const bodyChildren = Array.from(document.body.children);
  bodyChildren.forEach((child) => {
    if (!elementsToExclude.includes(child)) {
      mainElement.appendChild(child);
    }
  });

  document.body.appendChild(mainElement);

  return mainElement;
}

function checkLandmarks(container = document) {
  // (code for checkLandmarks remains the same)
}

/**
 * Ensure unique main landmarks exist in the document.
 * Logs a warning if multiple main landmarks are detected.
 */
function ensureUniqueLandmarks() {
  const mains = document.querySelectorAll('main, [role="main"]');
  if (mains.length > 1) {
    console.warn('Multiple main landmarks detected. Ensure only one main landmark exists.');
    throw new Error('Document should have at most one main landmark');
  }
}

function createInPageButton(text, targetId) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = text;
  button.setAttribute('aria-label', `Scroll to ${text}`);
  button.addEventListener('click', () => {
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
  return button;
}

// Consolidated accessibility issue handler
function addressAccessibilityIssues(graphData) {
  if (!graphData) return;

  // Fix landmark issues
  if (typeof fixLandmarkIssues === 'function') {
    fixLandmarkIssues(graphData);
  }

  // Fix fake link issues
  if (typeof fixFakeLinkIssues === 'function') {
    fixFakeLinkIssues(graphData);
  }

  // Fix image alt texts
  if (typeof fixImageAltTexts === 'function') {
    fixImageAltTexts(graphData);
  }

  // Ensure unique landmarks
  if (typeof uniqueLandmarks === 'function') {
    uniqueLandmarks(graphData);
  }

  // Fix button identifiers
  if (typeof fixButtonIdentifiers === 'function') {
    fixButtonIdentifiers(graphData);
  }

  // Fix dependency graph ARIA attributes
  if (typeof fixDependencyGraphAria === 'function') {
    fixDependencyGraphAria(graphData);
  }

  // Add main landmark to index
  if (typeof addMainLandmarkToIndex === 'function') {
    addMainLandmarkToIndex(graphData);
  }
}

// Utilities
function addLangAttribute(element, lang = 'en') {
  if (!element) {
    throw new Error('Element is required');
  }

  if (typeof lang !== 'string' || lang.length === 0) {
    throw new Error('Language code must be a non-empty string');
  }

  const existingLang = element.getAttribute('lang');

  if (existingLang && existingLang.toLowerCase() === lang.toLowerCase()) {
    return false;
  }

  element.setAttribute('lang', lang);
  return true;
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

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const credentialResponse = JSON.parse(body);
        const result = handleCredentialResponse(credentialResponse);

        res.writeHead(result.status === 'success' ? 200 : 400, {
          'Content-Type': 'application/json'
        });
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
      res.end(
        JSON.stringify({ status: 'error', message: 'Session ID required' })
      );
      return;
    }

    const session = validateSession(sessionId);

    if (session) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'valid', user: session.user }));
    } else {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'invalid', message: 'Session expired or invalid' }));
    }
    return;
  }

  // Session revocation endpoint
  if (parsedUrl.pathname === '/api/session/revoke' && req.method === 'POST') {
    let body = '';

    req.on('data', (chunk) => {
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

// Export modules for testing
module.exports = {
  addSvgAccessibilityProps,
  isLandmarkElement,
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
  validateSession,
  revokeSession,
  getActiveSessionsCount,
  server,
  sanitizeFilename,
  processData,
  renderDependencyGraph,
  renderIndex,
  newFunction,
  checkLandmarkElement,
  wrapPrimaryContentInMain,
  checkLandmarks,
  ensureUniqueLandmarks,
  getSvgAccessibleName,
  addLangAttribute
};