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

/**
 * Ensures an element has a unique ID
 * @param {HTMLElement} element - The element to check
 * @returns {string} The element's ID
 */
function ensureId(element) {
    if (!element.id) {
        element.id = `element-${Math.random().toString(36).substr(2, 9)}`;
    }
    return element.id;
}

/**
 * Accessibility-related changes
function getAccessibleServerUrl(serverUrl) {
  // Implement ARIA-compatible URL handling, if necessary
  // On production, hide #hash symbol or set a valid ARIA attribute for the hash
  const accessibleUrl = serverUrl.replace(/#/g, ''); // Replace '#' with empty string as a simple example
  return accessibleUrl;
}

/**
 * Starts the application and returns the server URL with accessibility improvements
 * @returns {string} The server URL with accessibility improvements
 */
async function startAccessibleApp() {
  const server = createServer();
  const accessibleServerUrl = getAccessibleServerUrl(`http://localhost:${config.port}`);
  server.listen(config.port, () => {
    console.log(`Server running on port ${config.port}: ${accessibleServerUrl}`);
    return accessibleServerUrl;
  });
}

/**
 * Export functions for testing, including the new accessible functions
 */
module.exports = {
  createServer,
  startApp,
  startAccessibleApp, // New accessible function
  config,
  getAccessibleServerUrl // New accessible function
};

// Start the application if run directly
if (require.main === module) {
  startAccessibleApp(); // Use the new accessible function
}

/**
 * Add Aria-label to an element if not present
 * @param {HTMLElement} element - The element to update
 * @param {string} label - The label text
 */
function addAriaLabel(element, label) {
    if (!element.getAttribute('aria-label')) {
        element.setAttribute('aria-label', label);
    }
}

/**
 * Creates and starts the HTTP server
 * @returns {http.Server} The created server instance
 */
function createServer() {
  const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
      handleResourceRequest(req, res);
    } else {
      res.writeHead(405, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Method not allowed' }));
    }
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
  config,
  handleResourceRequest // Export the new function
};

// Function to calculate the accessibility score
const calculateAccessibilityScore = function (fixedIssues) {
  if (!Array.isArray(fixedIssues)) {
    return 0;
  }

  const scorePoints = {
    'color-contrast': 5,
    'missing-alt-text': 3,
    'missing-aria-label': 5,
    'heading-order': 2,
    'other': 1
  };

  return fixedIssues.reduce((score, issue) => {
    const points = scorePoints[issue.type] || scorePoints['other'];
    return score + points;
  }, 0);
};

// Function to ensure unique landmarks from a string
const ensureUniqueLandmarksFromString = function (source) {
  const mainBlockRegex = /<main[^>]*>.*?<\/main>/gs;

  const matches = Array.from(source.matchAll(mainBlockRegex));
  if (matches.length <= 1) {
    return source;
  }

  let result = source;
  for (let i = 1; i < matches.length; i++) {
    const block = matches[i][0];
    const fixedBlock = block
      .replace(/<main([^>]*)>/, '<section$1>')
      .replace(/<\/main>/, '</section>');
    result = result.replace(block, fixedBlock);
  }

  return result;
};

// Function to validate a landmark
const validateLandmark = function (element) {
  if (!element) {
    return { valid: false, error: 'Element is required' };
  }

  const landmarkRoles = [
    'banner',
    'main',
    'navigation',
    'search',
    'contentinfo',
    'complementary',
    'region',
    'form'
  ];

  const tagName = element.tagName ? element.tagName.toLowerCase() : element.tagName;

  const implicitLandmarks = {
    'header': 'banner',
    'main': 'main',
    'nav': 'navigation',
    'aside': 'complementary',
    'footer': 'contentinfo',
    'section': 'region',
    'form': 'form'
  };

  let landmarkRole = element.getAttribute ? element.getAttribute('role') : element.role;

  if (!landmarkRole && implicitLandmarks[tagName]) {
    landmarkRole = implicitLandmarks[tagName];
  }

  if (!landmarkRole) {
    return {
      valid: false,
      error: 'Element does not have a valid landmark role',
      element: tagName
    };
  }

  if (!landmarkRoles.includes(landmarkRole)) {
    return {
      valid: false,
      error: `Invalid landmark role: ${landmarkRole}`,
      element: tagName,
      role: landmarkRole
    };
  }

  return { valid: true, element: tagName, role: landmarkRole };
};

// Function to handle credential response from browser authentication
// @param {Object} response - The credential response object
// @returns {Object} Processed credential information
function handleCredentialResponse(response) {
    if (!response) {
        return { success: false, error: 'No credential response provided' };
    }

    // Check if response contains expected credential data
    const hasCredential = response.credential || response.token || response.id;

    if (!hasCredential) {
        return { success: false, error: 'Invalid credential response format' };
    }

    // Process credential information
    const processedCredential = {
        id: response.id || null,
        token: response.token || response.credential || null,
        name: response.name || 'Anonymous User',
        email: response.email || null,
        success: true
    };

    // Handle different types of credential responses
    if (response.credential) {
        // Google Sign-In response
        try {
            // Credential is a base64-encoded JWT
            const payload = JSON.parse(atob(response.credential.split('.')[1]));
            processedCredential.id = payload.sub || processedCredential.id;
            processedCredential.email = payload.email || processedCredential.email;
            processedCredential.name = payload.name || processedCredential.name;
        } catch (error) {
            console.warn('Failed to parse credential response:', error);
        }
    }

    // Announce success to screen readers
    if (typeof announceToScreenReader === 'function') {
        announceToScreenReader('User successfully authenticated');
    }

    return processedCredential;
}

// Ensure DOM is fully loaded before executing scripts
if (typeof module !== 'undefined' && module.exports) {
  // Node.js environment - setup basic exports
  module.exports = {
    checkTableStructure,
    countDependencies,
    init,
    main,
    setupAriaLiveRegions,
    setupFocusManagement,
    enhanceSemanticMarkup,
    trapFocus,
    handleKeyNavigation,
    closeOpenDialogs,
    announceToScreenReader,
    calculateDifference,
    calculateProduct,
    isNumber,
    clamp,
    hello,
    getVersion,
    getConfig,
    addressAccessibilityIssues,
    generateAccessibilityReport,
    calculateAccessibilityScore,
    fixMainLandmarks,
    validateLandmark,
    handleCredentialResponse,
    ensureId,
    addAriaLabel,
    getSvgAccessibleName,
    setSvgAttributes,
    processData,
    newFunction
  };
} else {
  // Browser environment - wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}

function init() {
  main();
  setupAriaLiveRegions();
  setupFocusManagement();
  enhanceSemanticMarkup();
}

function getSvgAccessibleName(svg) {
    const title = svg.querySelector('title');
    if (title && title.textContent.trim()) {
        return title.textContent.trim();
    }
    
    const desc = svg.querySelector('desc');
    if (desc && desc.textContent.trim()) {
        return desc.textContent.trim();
    }
    
    return svg.getAttribute('aria-label') || svg.getAttribute('aria-labelledby') || '';
}

function setSvgAttributes(svg) {
    if (!svg.hasAttribute('role')) {
```