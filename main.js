const main = require('./utilities');

const { createInPageButton, createWebResourceButton, validateLandmark, validateLandmarkStructure, validateAccessibilityReport } = require('./utilities');

const { addLangAttribute, fixTableStructureIssues, addMainLandmark, ensureUniqueLandmarks, setSvgAccessibilityProps, addSvgAccessibleNames, addAccessibleNamesToSVGs, fixFakeLinkIssue, fixFakeLinkIssues, fixLandmarkIssues, addLandmarkRegions, uniqueLandmarks, fixImageAltTexts, googleSignIn, handleCredentialResponse, ensureElementHasId, ensureElementHasIdOrigin, addAriaLabel, renderDependencyGraphs, fixButtonIdentifiers, fixDependencyGraphAria, addMainLandmarkToIndex, addressAccessibilityIssues } = main;

const http = require('http');

const { functionA, functionB } = require('./functionModule');

const a11yStore = {
  // ... existing methods ...
};

const renderGraphIndex = (graphData) => {
  renderDependencyGraph(graphData);
};

const getSvgAccessibleName = (svgElement) => {
  return getSvgAccessibleName(svgElement);
};

function detectAndSetLang(content) {
  return detectAndSetLang(content);
}

function renderDependencyGraph(deps, options = {}) {
  return dependencyGraphContent(deps, options);
}

function renderIndex(data, options = {}) {
  return indexContent(data, options);
}

function newFunction() {
  return newFunction();
}

function wrapPrimaryContentInMain() {
  return wrapPrimaryContentInMain();
}

function checkLandmarkElement(role, element) {
  return checkLandmarkElement(role, element);
}

function checkLandmarks(container = document) {
  return checkLandmarks(container);
}

function ensureUniqueLandmarks() {
  return ensureUniqueLandmarks();
}

function revokeSession(sessionId) {
  return revokeSession(sessionId);
}

function handleFocusTrap(element) {
  return handleFocusTrap(element);
}

const server = http.createServer((req, res) => {
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
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', sessions: getActiveSessionsCount() }));
    return;
  }

  // Credential response endpoint
  if (req.url === '/api/credential' && req.method === 'POST') {
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
  if (req.url === '/api/session/validate' && req.method === 'GET') {
    const sessionId = req.url.split('sessionId=')[1];

    if (!sessionId) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'error', message: 'Session ID required' }));
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
  if (req.url === '/api/session/revoke' && req.method === 'POST') {
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

module.exports = {
  renderDependencyGraph,
  renderIndex,
  renderGraphIndex,
  newFunction,
  checkLandmarkElement,
  wrapPrimaryContentInMain,
  checkLandmarks,
  ensureUniqueLandmarks,
  handleFocusTrap,
  revokeSession,
  functionA,
  functionB
};