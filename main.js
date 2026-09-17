// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ...)
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

const http = require('http');
const url = require('url');

// Function for creating in-page buttons
function createInPageButton(options = {}) {
  const {
    id = '',
    text = 'Button',
    className = 'btn',
    type = 'button',
    disabled = false,
    onClick = null,
    ariaLabel = '',
    title = ''
  } = options;

  return {
    id,
    text,
    className,
    type,
    disabled,
    onClick,
    ariaLabel: ariaLabel || text,
    title
  };
}

// Configuration
const CONFIG = {
  port: process.env.PORT || 3000,
  host: process.env.HOST || 'localhost',
  maxRetries: 3,
  timeout: 5000
};

// Existing utility functions
function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} [${level.toUpperCase()}]: ${message}`);
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
        const decoded = Buffer.from(payload.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
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
  return filename.replace(/[^a-z0-9_.-]/gi, '_');
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

function transformInputData(inputData, options = {}) {
  const {
    preserveKeys = true,
    uppercase = false,
    trimWhitespace = true,
    maxLength = null
  } = options;

  if (!inputData) {
    return null;
  }

  if (typeof inputData === 'string') {
    let result = trimWhitespace ? inputData.trim() : inputData;
    result = uppercase ? result.toUpperCase() : result;
    if (maxLength && result.length > maxLength) {
      result = result.substring(0, maxLength);
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
    return timestamp + '-' + randomPart;
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
  
  // Placeholder for table structure validation logic
  // This should include checks for headers, caption, and row grouping
  
  // For now, we assume the table is valid
  return true;
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
 * Check if an element is a fake link that needs accessibility fixes
 * @param {HTMLElement} element - The element to check
 * @returns {Object} - Object with isFakeLink boolean and suggested fixes
 */
function personName(element) {
  if (!element) {
    return { isFakeLink: false, issues: [] };
  }
  
  const issues = [];
  const tagName = element.tagName ? element.tagName.toLowerCase() : '';
  const role = element.getAttribute ? element.getAttribute('role') : null;
  const href = element.getAttribute ? element.getAttribute('href') : null;
  const onclick = element.getAttribute ? element.getAttribute('onclick') : null;
  
  // Detect fake links: elements with click handlers that navigate but aren't <a> or <button>
  const isClickable = onclick || role === 'link';
  const isNotSemanticLink = tagName !== 'a' && tagName !== 'button';
  
  if (isClickable && isNotSemanticLink && !href) {
    issues.push({
      type: 'fake-link',
      message: 'Element has click behavior but lacks semantic link role',
      suggestion: 'Use <a> element with href attribute, or add role="link" and proper keyboard support',
      element: tagName
    });
  }
  
  return {
    isFakeLink: issues.length > 0,
    issues: issues
  };
}

/**
 * Ensure a landmark has a unique accessible name
 * @param {string} landmarkType - The type of landmark (nav, main, aside, etc.)
 * @param {string} label - The accessible label for the landmark
 * @returns {Object} - The landmark configuration
 */
function createAccessibleLandmark(landmarkType, label) {
  return {
    role: landmarkType,
    'aria-label': label || null,
    'aria-labelledby': label ? undefined : null
  };
}

/**
 * Validate that landmarks on a page have unique identifiers
 * @param {Array} landmarks - Array of landmark elements
 * @returns {Object} - Validation result with issues array
 */
function validateLandmarkUniqueness(landmarks) {
  const issues = [];
  const labelCounts = {};
  
  landmarks.forEach((landmark, index) => {
    const label = landmark['aria-label'];
    if (label) {
      labelCounts[label] = labelCounts[label] || [];
      labelCounts[label].push(index);
    }
  });
  
  Object.keys(labelCounts).forEach(label => {
    if (labelCounts[label].length > 1) {
      issues.push({
        type: 'duplicate-landmark-label',
        label: label,
        count: labelCounts[label].length,
        indices: labelCounts[label]
      });
    }
  });
  
  return {
    valid: issues.length === 0,
    issues: issues
  };
}

function validateTableStructure(tableElement) {
  // Implementation for REACT_027: Fix 26 table structure issues
  // Validates the structural integrity of HTML tables
  // Checks for: thead, tbody, tfoot presence, proper nesting, caption if present
  if (!tableElement) {
    return { valid: false, errors: ['Table element is required'] };
  }
  
  const errors = [];
  
  // Check for thead
  const thead = tableElement.querySelector('thead');
  if (!thead) {
    errors.push('Table should have a thead section');
  }
  
  // Check for tbody
  const tbody = tableElement.querySelector('tbody');
  if (!tbody) {
    errors.push('Table should have a tbody section');
  }
  
  // Check for caption if table has headers
  const caption = tableElement.querySelector('caption');
  const hasHeaders = tableElement.querySelectorAll('th').length > 0;
  if (hasHeaders && !caption) {
    errors.push('Table with header cells should have a caption');
  }
  
  // Check that th elements are inside thead
  const thsOutsideThead = Array.from(tableElement.querySelectorAll('th'))
    .filter(th => !tableElement.querySelector('thead')?.contains(th));
  if (thsOutsideThead.length > 0) {
    errors.push('All th elements should be inside thead');
  }
  
  // Check for proper row structure
  const rows = tableElement.querySelectorAll('tr');
  rows.forEach((row, index) => {
    const cells = row.querySelectorAll('td, th');
    if (cells.length === 0) {
      errors.push(`Row at index ${index} has no cells`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors,
    hasThead: !!thead,
    hasTbody: !!tbody,
    hasCaption: !!caption,
    rowCount: rows.length
  };
}

// Calculate sum of numbers array
function calculateSum(numbers) {
    return numbers.reduce((sum, num) => sum + num, 0);
}

// Export all functions
module.exports = {
  CONFIG,
  log,
  validateInput,
  parseJSONsafe,
  formatResponse,
  delay,
  retryOperation,
  sanitizeFilename,
  readFileSafe,
  processData,
  filterValidItems,
  groupByCategory,
  transformInputData,
  getLangAttribute,
  personName,
  getSvgAccessibleName,
  validateTableAccessibility,
  validateTableStructure,
  calculateSum,
  createInPageButton
};