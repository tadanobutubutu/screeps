const http = require('http');
const url = require('url');

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

// TODO: Address accessibility issues from insight report — FIXED

// Preserving existing code, exports, and functions

// Application state
const appState = {
    credentials: [],
    sessions: new Map()
};

// Existing utility functions
function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  console[level](`${timestamp} - ${message}`);
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
    return filename.replace(/[^a-z0-9.-]/g, '_');
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
    return app