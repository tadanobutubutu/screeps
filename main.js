// main.js - Main application entry point

// Import required modules
const http = require('http');
const url = require('url');

// Application state
const appState = {
    credentials: [],
    sessions: new Map()
};

/**
 * Parse and validate a credential response
 * @param {Object} response - The credential response object
 * @returns {Object} - Parsed and validated response data
 */
function parseCredentialResponse(response) {
    if (!response || typeof response !== 'object') {
        return {
            success: false,
            error: 'Invalid response format'
        };
    }

    return {
        success: true,
        credential: response.credential || null,
        select_by: response.select_by || null,
        clientId: response.client_id || null
    };
}

/**
 * Decode a JWT token (base64url decode)
 * @param {string} token - The JWT token string
 * @returns {Object} - Decoded token payload
 */
function decodeJwtToken(token) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('Invalid JWT format');
        }
        
        const payload = parts[1];
        const decoded = Buffer.from(payload.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8');
        return JSON.parse(decoded);
    } catch (error) {
        return null;
    }
}

/**
 * Handle credential response from OAuth/identity provider
 * @param {Object} credentialResponse - The credential response
 * @returns {Object} - Result of handling the credential
 */
function handleCredentialResponse(credentialResponse) {
    const parsedResponse = parseCredentialResponse(credentialResponse);
    
    if (!parsedResponse.success) {
        return {
            status: 'error',
            message: parsedResponse.error
        };
    }

    const credential = parsedResponse.credential;
    
    if (!credential) {
        return {
            status: 'error',
            message: 'No credential provided'
        };
    }

    // Decode the JWT token to extract user information
    const decodedToken = decodeJwtToken(credential);
    
    if (!decodedToken) {
        return {
            status: 'error',
            message: 'Failed to decode credential token'
        };
    }

    // Create session for the authenticated user
    const sessionId = generateSessionId();
    const sessionData = {
        user: {
            email: decodedToken.email,
            name: decodedToken.name,
            picture: decodedToken.picture,
            sub: decodedToken.sub
        },
        authenticatedAt: Date.now(),
        credential: credential
    };

    appState.sessions.set(sessionId, sessionData);
    appState.credentials.push({
        sessionId,
        clientId: parsedResponse.clientId,
        timestamp: Date.now()
    });

    return {
        status: 'success',
        sessionId,
        user: sessionData.user
    };
}

/**
 * Generate a unique session ID
 * @returns {string} - Generated session ID
 */
function generateSessionId() {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 15);
    return `${timestamp}-${randomPart}`;
}

/**
 * Validate an existing session
 * @param {string} sessionId - The session ID to validate
 * @returns {Object|null} - Session data if valid, null otherwise
 */
function validateSession(sessionId) {
    const session = appState.sessions.get(sessionId);
    
    if (!session) {
        return null;
    }

    // Check session expiration (24 hours)
    const expirationTime = 24 * 60 * 60 * 1000;
    const now = Date.now();
    
    if (now - session.authenticatedAt > expirationTime) {
        appState.sessions.delete(sessionId);
        return null;
    }

    return session;
}

/**
 * Revoke a session
 * @param {string} sessionId - The session ID to revoke
 * @returns {boolean} - True if session was revoked
 */
function revokeSession(sessionId) {
    return appState.sessions.delete(sessionId);
}

/**
 * Get all active sessions count
 * @returns {number} - Number of active sessions
 */
function getActiveSessionsCount() {
    return appState.sessions.size;
}

/**
 * Ensures the element has an id. If the element doesn't have an id,
 * generates one and assigns it to the element.
 * @param {HTMLElement} element - The element to check and modify
 * @param {string} [prefix='element'] - Prefix for the generated id
 * @returns {string} The element's id (existing or newly generated)
 */
function ensureElementHasId(element, prefix = 'element') {
  if (!element) {
    throw new Error('Element is required');
  }
  
  if (element.id) {
    return element.id;
  }
  
  const id = `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  element.id = id;
  return id;
}

/**
 * Adds an aria-label attribute to the element if it doesn't already have one.
 * @param {HTMLElement} element - The element to modify
 * @param {string} label - The aria-label value to set
 * @returns {boolean} True if label was added, false if element already had one
 */
function addAriaLabel(element, label) {
  if (!element) {
    throw new Error('Element is required');
  }
  
  if (!label) {
    throw new Error('Label is required');
  }
  
  if (element.getAttribute('aria-label')) {
    return false;
  }
  
  element.setAttribute('aria-label', label);
  return true;
}

/**
 * Renders dependency graphs for the given configuration.
 * @param {HTMLElement} container - The container element to render into
 * @param {Object} dependencies - The dependencies data to render
 * @param {Object} [options={}] - Optional rendering configuration
 * @returns {Object} The rendered graph instance
 */
function renderDependencyGraphs(container, dependencies, options = {}) {
  if (!container) {
    throw new Error('Container element is required');
  }
  
  if (!dependencies) {
    throw new Error('Dependencies data is required');
  }
  
  // Ensure container has an id for graph references
  const containerId = ensureElementHasId(container, 'graph-container');
  
  // Add accessibility label if not present
  const hasAriaLabel = addAriaLabel(container, `Dependency graph: ${containerId}`);
  
  // Placeholder for graph rendering logic
  // Actual implementation would use a library like D3.js or similar
  const graphData = {
    id: containerId,
    dependencies: dependencies,
    options: options,
    rendered: true,
    timestamp: new Date().toISOString()
  };
  
  console.log('Rendering dependency graphs:', graphData);
  
  return graphData;
}

/**
 * Checks if the element has accessible naming (via id, aria-label, or aria-labelledby).
 * @param {HTMLElement} element - The element to check
 * @returns {Object} Object with hasAccessibleName boolean and namingMethods array
 */
function checkElementAccessibility(element) {
  if (!element) {
    throw new Error('Element is required');
  }
  
  const namingMethods = [];
  
  if (element.id) {
    namingMethods.push('id');
  }
  if (element.getAttribute('aria-label')) {
    namingMethods.push('aria-label');
  }
  if (element.getAttribute('aria-labelledby')) {
    namingMethods.push('aria-labelledby');
  }
  
  return {
    hasAccessibleName: namingMethods.length > 0,
    namingMethods: namingMethods
  };
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
    });
}

// Export modules for testing
module.exports = {
    // Authentication/session management
    handleCredentialResponse,
    parseCredentialResponse,
    decodeJwtToken,
    validateSession,
    revokeSession,
    getActiveSessionsCount,
    server,
    // DOM accessibility utilities
    ensureElementHasId,
    addAriaLabel,
    renderDependencyGraphs,
    checkElementAccessibility
};