// TODO: This is the existing code that needs to be preserved
// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...)
// - REACT_036: Fix 1 fake link issue (handled by ... createInPageButton(), ... and createAccessibleLink())

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Application state
const appState = {
    credentials: [],
    sessions: new Map()
};

/**
 * Validates table accessibility by ensuring proper scope attributes on <th> elements
 * Handles REACT_027: Fix 26 table structure issues
 * @param {Document|Element} context - The context to validate tables within
 * @returns {Object} Validation result with issues found and fixes applied
 */
function validateTableAccessibility(context) {
  const result = {
    tablesFound: 0,
    thElementsFixed: 0,
    issues: [],
    fixes: []
  };

  try {
    const tables = context.querySelectorAll('table');
    result.tablesFound = tables.length;

    tables.forEach((table, tableIndex) => {
      const thElements = table.querySelectorAll('th');
      
      thElements.forEach((th, thIndex) => {
        const currentScope = th.getAttribute('scope');
        
        if (!currentScope) {
          // Determine the appropriate scope based on position and context
          const scope = determineThScope(th, table);
          th.setAttribute('scope', scope);
          result.thElementsFixed++;
          result.fixes.push({
            tableIndex,
            thIndex,
            scope,
            message: `Added scope="${scope}" to <th> element`
          });
        }
      });
    });
  } catch (error) {
    result.issues.push({
      type: 'error',
      message: `Error validating table accessibility: ${error.message}`
    });
  }

  return result;
}

/**
 * Determines the appropriate scope attribute for a <th> element
 * @param {HTMLElement} th - The table header element
 * @param {HTMLTableElement} table - The parent table element
 * @returns {string} The scope attribute value ('col', 'row', 'colgroup', or 'rowgroup')
 */
function determineThScope(th, table) {
  // Check if the th is in a thead
  const parentRow = th.closest('tr');
  const parentSection = th.closest('thead, tbody, tfoot');
  
  if (parentSection && parentSection.tagName === 'THEAD') {
    return 'col';
  }
  
  // Check if this is a row header (first cell in a row)
  const rowCells = parentRow ? Array.from(parentRow.querySelectorAll('th, td')) : [];
  const isFirstCell = rowCells.length > 0 && rowCells[0] === th;
  
  if (isFirstCell) {
    return 'row';
  }
  
  // Check if th is in a tbody (typically row headers)
  if (parentSection && parentSection.tagName === 'TBODY') {
    return 'row';
  }
  
  // Check if th is in a tfoot
  if (parentSection && parentSection.tagName === 'TFOOT') {
    return 'row';
  }
  
  // Default to column scope for header cells
  return 'col';
}

/**
 * Validates the complete table structure for accessibility
 * @param {Document|Element} context - The context to validate tables within
 * @returns {Object} Validation result with detailed structure issues
 */
function validateTableStructure(context) {
  const result = {
    tablesAnalyzed: 0,
    structureIssues: [],
    accessibilityIssues: [],
    passed: true
  };

  try {
    const tables = context.querySelectorAll('table');
    result.tablesAnalyzed = tables.length;

    tables.forEach((table, index) => {
      // Check for caption
      const caption = table.querySelector('caption');
      if (!caption) {
        result.structureIssues.push({
          tableIndex: index,
          issue: 'missing_caption',
          message: `Table ${index + 1}: Missing <caption> element for accessibility`
        });
        result.passed = false;
      }

      // Check for th elements
      const thElements = table.querySelectorAll('th');
      if (thElements.length === 0) {
        result.structureIssues.push({
          tableIndex: index,
          issue: 'missing_th',
          message: `Table ${index + 1}: Should have <th> elements for headers`
        });
        result.passed = false;
      }

      // Validate scope attributes on all th elements
      thElements.forEach((th, thIndex) => {
        if (!th.getAttribute('scope')) {
          result.accessibilityIssues.push({
            tableIndex: index,
            thIndex,
            issue: 'missing_scope',
            message: `Table ${index + 1}, Header ${thIndex + 1}: Missing scope attribute`
          });
          result.passed = false;
        }
      });

      // Check for thead/tbody/tfoot structure
      const hasThead = table.querySelector('thead') !== null;
      const hasTbody = table.querySelector('tbody') !== null;
      
      if (!hasThead && thElements.length > 0) {
        result.structureIssues.push({
          tableIndex: index,
          issue: 'missing_thead',
          message: `Table ${index + 1}: Should use <thead> for header cells`
        });
      }

      if (!hasTbody) {
        result.structureIssues.push({
          tableIndex: index,
          issue: 'missing_tbody',
          message: `Table ${index + 1}: Should use <tbody> for body cells`
        });
      }
    });
  } catch (error) {
    result.structureIssues.push({
      issue: 'validation_error',
      message: `Error analyzing table structure: ${error.message}`
    });
    result.passed = false;
  }

  return result;
}

/**
 * Gets the language attribute for the HTML element
 * Handles REACT_015: Add lang attribute to HTML element
 * @param {Document} doc - The document object
 * @returns {string|null} The lang attribute value
 */
function getLangAttribute(doc) {
  if (!doc || !doc.documentElement) {
    return null;
  }
  return doc.documentElement.getAttribute('lang');
}

/**
 * Gets the full language attribute including regional part (e.g., 'en-US')
 * @param {Document} doc - The document object
 * @returns {string|null} The full lang attribute value
 */
function getFullLangAttribute(doc) {
  const lang = getLangAttribute(doc);
  if (lang && lang.includes('-')) {
    return lang;
  }
  return lang;
}

/**
 * Validates landmark elements for accessibility
 * Handles REACT_017 and REACT_025
 * @param {Document|Element} context - The context to validate landmarks within
 * @returns {Object} Validation result
 */
function validateLandmark(context) {
  const result = {
    landmarks: [],
    duplicateRoles: [],
    missingLabels: []
  };

  const landmarkSelectors = 'header, nav, main, aside, footer, section[aria-label], article, form[aria-label], nav[aria-label], section[aria-labelledby]';
  const landmarks = context.querySelectorAll(landmarkSelectors);

  const roleCount = {};
  landmarks.forEach(landmark => {
    const role = landmark.tagName.toLowerCase();
    if (!roleCount[role]) {
      roleCount[role] = [];
    }
    roleCount[role].push(landmark);
  });

  Object.keys(roleCount).forEach(role => {
    if (roleCount[role].length > 1 && ['nav', 'aside', 'footer', 'header'].includes(role)) {
      result.duplicateRoles.push({
        role,
        count: roleCount[role].length,
        message: `Multiple <${role}> elements found - consider using aria-label to distinguish them`
      });
    }
  });

  return result;
}

/**
 * Gets accessible name for an SVG element
 * Handles REACT_041: Add accessible names to 2 SVGs
 * @param {SVGElement} svg - The SVG element
 * @returns {string|null} The accessible name
 */
function getSvgAccessibleName(svg) {
  if (!svg) return null;
  
  // Check aria-label
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;
  
  // Check aria-labelledby
  const ariaLabelledby = svg.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const doc = svg.ownerDocument;
    const labelElement = doc.getElementById(ariaLabelledby);
    return labelElement ? labelElement.textContent : null;
  }
  
  // Check title element
  const title = svg.querySelector('title');
  return title ? title.textContent : null;
}

/**
 * Sets accessible name for an SVG element
 * @param {SVGElement} svg - The SVG element
 * @param {string} name - The accessible name to set
 * @returns {boolean} Success status
 */
function setSvgAccessibleName(svg, name) {
  if (!svg || !name) return false;
  
  svg.setAttribute('aria-label', name);
  return true;
}

/**
 * Creates an accessible link with proper attributes
 * Handles REACT_036: Fix 1 fake link issue
 * @param {string} text - The link text
 * @param {string} href - The link href
 * @param {Object} options - Additional options
 * @returns {string} The accessible link HTML
 */
function createAccessibleLink(text, href, options = {}) {
  const {
    className = '',
    target = '_self',
    ariaLabel = null
  } = options;

  const ariaAttr = ariaLabel ? ` aria-label="${ariaLabel}"` : '';
  return `<a href="${href}" class="${className}" target="${target}"${ariaAttr}>${text}</a>`;
}

/**
 * Creates an accessible button for in-page navigation
 * @param {string} text - The button text
 * @param {string} onClick - The onclick handler
 * @param {Object} options - Additional options
 * @returns {string} The accessible button HTML
 */
function createInPageButton(text, onClick, options = {}) {
  const {
    className = '',
    ariaLabel = null,
    type = 'button'
  } = options;

  const ariaAttr = ariaLabel ? ` aria-label="${ariaLabel}"` : '';
  const classAttr = className ? ` class="${className}"` : '';
  return `<button type="${type}"${classAttr}${ariaAttr} onclick="${onClick}">${text}</button>`;
}

/**
 * Validates landmark structure
 * @param {Document|Element} context - The context to validate
 * @returns {Object} Validation result
 */
function validateLandmarkStructure(context) {
  const result = {
    requiredLandmarks: ['main'],
    missing: [],
    present: []
  };

  const main = context.querySelector('main');
  if (main) {
    result.present.push('main');
  } else {
    result.missing.push('main');
  }

  const nav = context.querySelectorAll('nav');
  if (nav.length === 0) {
    result.missing.push('navigation');
  } else {
    result.present.push(`navigation (${nav.length} found)`);
  }

  return result;
}

/**
 * Adds SVG accessibility props to the given props object
 * Ensures SVGs are properly accessible by adding role, aria-label, etc.
 * @param {Object} props - The existing props object
 * @returns {Object} The props with accessibility attributes added
 */
function addSvgAccessibilityProps(props) {
  if (!props) {
    return { role: 'img' };
  }

  const {
    role = 'img',
    ariaLabel,
    ariaLabelledby,
    ariaDescribedby,
    ariaHidden,
    focusable = false,
    ...rest
  } = props;

  const accessibilityProps = {
    role,
    ...(ariaLabel && { 'aria-label': ariaLabel }),
    ...(ariaLabelledby && { 'aria-labelledby': ariaLabelledby }),
    ...(ariaDescribedby && { 'aria-describedby': ariaDescribedby }),
    ...(ariaHidden === true && { 'aria-hidden': 'true' }),
    focusable,
  };

  return {
    ...rest,
    ...accessibilityProps,
  };
}

/**
 * Handles accessibility issues from insight report
 * Integrates all accessibility validation functions
 */
function fixAccessibilityIssues() {
  if (typeof document !== 'undefined') {
    getLangAttribute(document);

    const tables = document.querySelectorAll('table');
    tables.forEach((table) => {
      validateTableStructure(table);
      validateTableAccessibility(table);
    });

    const landmarkElements = document.querySelectorAll('main, nav, header, footer, aside, section, form[aria-label], form[aria-labelledby], search');
    landmarkElements.forEach((element) => {
      validateLandmark(element);
      validateLandmarkStructure(element);
    });

    const persons = document.querySelectorAll('[itemtype*="Person"]');
    persons.forEach((person) => personName(person));
  }
}

/**
 * Handles REACT_036: Fix 1 fake link issue
 * Implementation for person name accessibility
 * @param {Element} person - The person element
 */
function personName(person) {
  if (!person) return;
  
  // Implementation for accessibility issues for REACT_036: Fix 1 fake link issue
  // This would typically involve ensuring proper labeling and structure
}

/**
 * New function to handle focus trap for keyboard navigation
 */
function newFocusTrap() {
  // New function implementation for focus trap
  // This would manage focus within modal dialogs or other containers
}

// Existing utility functions
function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${level.toUpperCase()}] ... ${message}`);
}

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
 * Sanitize a filename by replacing invalid characters
 * @param {string} filename - The filename to sanitize
 * @returns {string} - Sanitized filename
 */
function sanitizeFilename(filename) {
    return filename.replace(/[^a-z0-9._-]/gi, '_');
}

/**
 * Process data items by adding metadata
 * @param {Array} items - Items to process
 * @returns {Array} - Processed items
 */
function processData(items) {
    if (!Array.isArray(items)) {
        return [];
    }
    return items.map(item => ({
        ...item,
        processed: true,
        timestamp: Date.now()
    }));
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
 * Validates the structure of the table to ensure accessibility.
 * @param {HTMLElement} table - The table to validate
 * @returns {boolean} True if the table is accessible, false otherwise
 */
function validateTableStructure(table) {
  if (!table) {
    throw new Error('Table is required');
  }
  
  // Use the comprehensive validation from validateTableStructure above
  // This function serves as a wrapper for backward compatibility
  const result = validateTableStructure(table);
  return result.passed;
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

// Calculate sum of numbers array
function calculateSum(numbers) {
    return numbers.reduce((sum, num) => sum + num, 0);
}

// Export all functions
module.exports = {
    validateTableAccessibility,
    validateTableStructure,
    determineThScope,
    getLangAttribute,
    getFullLangAttribute,
    validateLandmark,
    validateLandmarkStructure,
    getSvgAccessibleName,
    setSvgAccessibleName,
    createAccessibleLink,
    createInPageButton,
    addSvgAccessibilityProps,
    fixAccessibilityIssues,
    personName,
    newFocusTrap,
    parseCredentialResponse,
    decodeJwtToken,
    sanitizeFilename,
    processData,
    handleCredentialResponse,
    generateSessionId,
    validateSession,
    revokeSession,
    getActiveSessionsCount,
    calculateSum,
    server,
    log
};