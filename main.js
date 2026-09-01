// main.js - Accessibility-focused implementation

// Functions to ensure the element has an id, add aria-label, render dependency graphs
// <!-- todo-hash: 4bdb3fdb46f8c23568fe2832e296806312b7e888 -->

const AddressabilityIssues = {
  MISSING_ID: 'missing-id',
  MISSING_ALT: 'missing-alt',
  MISSING_ARIA_LABEL: 'missing-aria-label',
  MISSING_ROLE: 'missing-role',
  LOW_CONTRAST: 'low-contrast',
  TINY_SIZE: 'tiny-size'
};

/**
 * Main application entry point with accessibility features
 */

function initializeAccessibility(container) {
  const svgElements = container.querySelectorAll('svg');

  svgElements.forEach(svg => {
    if (!svg.id) {
      svg.id = generateUniqueId();
    }

    if (!svg.getAttribute('role')) {
      svg.setAttribute('role', 'img');
    }

    const accessibleName = getSvgAccessibleName(svg);
    if (accessibleName) {
      svg.setAttribute('aria-label', accessibleName);
    }

    setSvgAttributes(svg);
  });

  return {
    issues: detectAccessibilityIssues(svgElements),
    count: svgElements.length
  };
}

function getSvgAccessibleName(svg) {
  if (!svg) return '';
  return svg.getAttribute('aria-label') || svg.getAttribute('aria-labelledby') || svg.querySelector('title')?.textContent || '';
}

function setSvgAttributes(svg) {
  if (!svg) return;
  const width = svg.getAttribute('width');
  const height = svg.getAttribute('height');
  if (width && parseInt(width) < 24) {
    svg.setAttribute('width', '24');
  }
  if (height && parseInt(height) < 24) {
    svg.setAttribute('height', '24');
  }
}

function checkTableStructure(table) {
  if (!table) {
    return { valid: false, error: 'Table element is required' };
  }

  const hasHeader = table.querySelector('thead') !== null || table.querySelector('th') !== null;
  const hasBody = table.querySelector('tbody') !== null;
  const hasCaption = table.querySelector('caption') !== null;

  return {
    valid: true,
    hasHeader,
    hasBody,
    hasCaption
  };
}

function generateUniqueId() {
  return 'svg-' + Math.random().toString(36).substr(2, 9);
}

function detectAccessibilityIssues(elements) {
  const issues = [];
  
  elements.forEach((element, index) => {
    if (!element.id) {
      issues.push({
        element: index,
        type: AddressabilityIssues.MISSING_ID,
        message: 'Element is missing an id attribute'
      });
    }
    
    if (!element.getAttribute('role')) {
      issues.push({
        element: index,
        type: AddressabilityIssues.MISSING_ROLE,
        message: 'Element is missing a role attribute'
      });
    }
  });

  return issues;
}

/**
 * Handles the credential response from an authentication flow
 * @param {Object} response - The credential response object
 * @param {string} response.token - The authentication token
 * @param {string} response.refreshToken - The refresh token
 * @param {number} response.expiresIn - Token expiration time in seconds
 * @returns {Object} Result object with success status and message
 */
function handleCredentialResponse(response) {
  if (!response) {
    return {
      success: false,
      message: 'No credential response provided'
    };
  }

  if (!response.token) {
    return {
      success: false,
      message: 'Token is missing from credential response'
    };
  }

  try {
    // Store credentials securely
    const credentialData = {
      token: response.token,
      refreshToken: response.refreshToken || null,
      expiresAt: response.expiresIn ? Date.now() + (response.expiresIn * 1000) : null,
      receivedAt: Date.now()
    };

    // Emit custom event for other components to handle
    if (typeof window !== 'undefined') {
      const credentialEvent = new CustomEvent('credential-response', {
        detail: credentialData,
        bubbles: true
      });
      window.dispatchEvent(credentialEvent);
    }

    return {
      success: true,
      message: 'Credential response handled successfully',
      data: credentialData
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to process credential response: ' + error.message
    };
  }
}

/**
 * Retrieves stored credentials if they're still valid
 * @returns {Object|null} The stored credential data or null if expired/missing
 */
function getStoredCredentials() {
  const stored = sessionStorage.getItem('credentials');
  if (!stored) return null;

  try {
    const credentials = JSON.parse(stored);
    if (credentials.expiresAt && Date.now() > credentials.expiresAt) {
      sessionStorage.removeItem('credentials');
      return null;
    }
    return credentials;
  } catch (error) {
    return null;
  }
}

/**
 * Clears stored credentials
 */
function clearCredentials() {
  sessionStorage.removeItem('credentials');
  if (typeof window !== 'undefined') {
    const clearEvent = new CustomEvent('credentials-cleared', {
      bubbles: true
    });
    window.dispatchEvent(clearEvent);
  }
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    AddressabilityIssues,
    initializeAccessibility,
    getSvgAccessibleName,
    setSvgAttributes,
    checkTableStructure,
    generateUniqueId,
    detectAccessibilityIssues,
    handleCredentialResponse,
    getStoredCredentials,
    clearCredentials
  };
}

// <!-- todo-hash: 7f86c29cec4fcb7d75fb6cf2fa756cf4c84b4121 -->