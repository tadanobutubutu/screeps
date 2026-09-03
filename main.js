const fs = require('fs');
const main = require('./utilities');

// TODO: This is the existing code that needs to be preserved
// (This should be preserved)
// Addressed accessibility issues from insight report

const {
  createInPageButton,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  getLangAttribute,
  validateAccessibilityReport,
  announceToScreenReader,
  handleKeyboardNav,
  newFocusTrap: originNewFocusTrap,
  exportUtils,
  addressAccessibilityIssues,
  handleCredentialResponse,
  ensureElementHasId: ensureElementIdOrigin,
  ensureElementHasId,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  focusTrap,
  renderAdditionalContent,
  transformInputData,
  initSkipLink,
  trapFocus,
  newFocusTrap: function (element, customFocusableSelector) {
      const focusableElements = element.querySelectorAll(customFocusableSelector || 'button, [href], input, select, textarea, ...');
      if (focusableElements.length === 0) return;
      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      element.addEventListener('keydown', function (e) {
          if (e.key === 'Tab') {
              if (e.shiftKey && document.activeElement === first) {
                  last.focus();
                  e.preventDefault();
              } else if (!e.shiftKey && document.activeElement === last) {
                  first.focus();
                  e.preventDefault();
              }
          }
      });
  }
} = main;

const accessibilityUtils = {
    createInPageButton,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    getSvgAccessibleName,
    getLangAttribute,
    validateAccessibilityReport,
    handleKeyboardNav,
    exportUtils,
    addressAccessibilityIssues,
    handleCredentialResponse,
    fixButtonIdentifiers,
    fixDependencyGraphAria,
    addMainLandmarkToIndex,
    focusTrap,
    renderAdditionalContent,
    transformInputData,
    initSkipLink,
    trapFocus,
    createWebResourceButton: (options) => {},
    personName: (name) => name,
    announceToScreenReader: function (message, priority) {
        if (priority === undefined) {
            priority = 'polite';
        }
        const announcer = document.createElement('div');
        announcer.setAttribute('aria-live', priority);
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only';
        announcer.style.position = 'absolute';
        announcer.style.left = '-9999px';
        announcer.textContent = message;
        document.body.appendChild(announcer);
        setTimeout(function () {
            announcer.remove();
        }, 1000);
    },
    newFocusTrap: function (element, customFocusableSelector) {
        const focusableElements = element.querySelectorAll(customFocusableSelector || 'button, [href], input, select, textarea, ...');
        if (focusableElements.length === 0) return;
        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        element.addEventListener('keydown', function (e) {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === first) {
                    last.focus();
                    e.preventDefault();
                } else if (!e.shiftKey && document.activeElement === last) {
                    first.focus();
                    e.preventDefault();
                }
            }
        });
    }
};

// Utility functions for ensuring elements have IDs and adding labels
const ensureElementHasIdImpl = (element, prefix = 'element') => {
  if (!element) {
    throw new Error('Element is required');
  }

  if (element.id) {
    return element.id;
  }

  const id = prefix + '-' + Math.random().toString(36).substring(2, 9);
  element.id = id;
  return id;
};

const ensureElementHasIdWithPrefix = (element, prefix = 'element') => {
  if (!element) {
    throw new Error('Element is required');
  }

  if (element.id) {
    return element.id;
  }

  const id = prefix + '-' + Math.random().toString(36).substring(2, 9);
  element.id = id;
  return id;
};

const ensureElementId = (element) => {
  if (element && !element.id) {
    element.id = 'el-' + Math.random().toString(36).substring(2, 9);
  }
  return element;
};

const addAriaLabel = (element, label) => {
  if (element) {
    element.setAttribute('aria-label', label);
  }
  return element;
};

const renderDependencyGraph = (data) => {
  // Implementation for rendering dependency graphs
  return {
    nodes: data.nodes || [],
    edges: data.edges || []
  };
};

function getTables() {
  return appData.tables;
}

// Implement the logic to handle the credential response
function handleCredentialResponse(credentialResponse) {
  // Validate the credential response
  if (!credentialResponse) {
    log('No credential response received', 'error');
    return Promise.reject(new Error('No credential response provided'));
  }

  // Extract the credential data from the response
  const credential = credentialResponse.credential || {};
  const credentialId = credential.id || credentialResponse.id;
  const rawId = credential.rawId || credentialResponse.rawId;
  const response = credential.response || credentialResponse.response || {};
  const authenticatorData = response.authenticatorData || response.clientDataJSON;
  const clientDataJSON = response.clientDataJSON;
  const signature = response.signature;
  const userHandle = response.userHandle;

  if (!clientDataJSON || (!signature && !authenticatorData)) {
    log('Invalid credential response: missing required fields', 'error');
    return Promise.reject(new Error('Invalid credential response'));
  }

  log('Processing credential response for ID: ' + credentialId, 'info');

  // Build the payload to send to the server for verification
  const verificationPayload = {
    id: credentialId,
    rawId: rawId,
    type: credential.type || credentialResponse.type || 'public-key',
    response: {
      authenticatorData: authenticatorData,
      clientDataJSON: clientDataJSON,
      signature: signature,
      userHandle: userHandle
    }
  };

  // Determine the verification endpoint (default or from response)
  const verifyEndpoint = credentialResponse.verifyEndpoint
    || credentialResponse.verificationUrl
    || '/api/auth/verify-credential';

  // Send the credential response to the server for verification
  return fetch(verifyEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(verificationPayload),
    credentials: 'same-origin'
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error('Credential verification failed with status: ' + res.status);
      }
      return res.json();
    })
    .then((verificationResult) => {
      log('Credential verification successful', 'info');

      // Announce successful authentication to screen readers
      try {
        accessibilityUtils.announceToScreenReader(
          'Authentication successful. You are now signed in.'
        );
      } catch (e) {
        // Screen reader announcement is best-effort
      }

      // Dispatch a custom event so the application can react to successful auth
      if (typeof document !== 'undefined') {
        document.dispatchEvent(new CustomEvent('credentialVerified', {
          detail: {
            credentialId: credentialId,
            result: verificationResult
          }
        }));
      }

      return {
        success: true,
        credentialId: credentialId,
        result: verificationResult
      };
    })
    .catch((error) => {
      log('Credential verification error: ' + (error && error.message ? error.message : error), 'error');

      try {
        accessibilityUtils.announceToScreenReader(
          'Authentication failed. Please try again.'
        );
      } catch (e) {
        // Screen reader announcement is best-effort
      }

      if (typeof document !== 'undefined') {
        document.dispatchEvent(new CustomEvent('credentialVerificationFailed', {
          detail: {
            credentialId: credentialId,
            error: error
          }
        }));
      }

      return {
        success: false,
        credentialId: credentialId,
        error: error
      };
    });
}

accessibilityUtils.initSkipLink = () => {
  const skipLink = document.querySelector('[data-skip-link]');
  if (!skipLink) {
    const skipContainer = document.createElement('div');
    skipContainer.id = 'skip-link';
    skipContainer.className = 'sr-only';
    skipContainer.style.position = 'fixed';
    skipContainer.style.top = '0';
    skipContainer.style.left = '0';
    skipContainer.style.width = '100%';
    skipContainer.style.height = '100%';
    skipContainer.style.zIndex = '99999';

    const skipLinkElement = document.createElement('a');
    skipLinkElement.href = '#main-content';
    skipLinkElement.textContent = 'Skip to main content';
    skipLinkElement.setAttribute('aria-label', 'Skip to main content');
    skipContainer.appendChild(skipLinkElement);
    document.body.insertBefore(skipContainer, document.body.firstChild);
  }
};

function getConfig() {
  return { ...appData.config };
}

function setConfig(config) {
  appData.config = { ...appData.config, ...config };
}

// Access the dependencyGraph container and ensure it has proper ARIA role
const dependencyGraph = document.querySelector('.dependency-graph');

if (dependencyGraph) {
  // Set appropriate ARIA role for the dependency graph container
  // Using 'region' role for a contained section of content
  if (!dependencyGraph.getAttribute('role')) {
    dependencyGraph.setAttribute('role', 'region');
  }

  // Add accessible label if not already present
  if (!dependencyGraph.getAttribute('aria-label')) {
    dependencyGraph.setAttribute('aria-label', 'Dependency graph visualization');
  }
}

// Required changes to fix the React SVG Accessible Name issue
function addAccessibleName(svgString, label) {
  // This function adds an `aria-label` attribute to the SVG if it doesn't already have one
  // and returns the modified SVG string.
  // Note: This is a simplified example and might need adjustments based on the actual SVG structure.
  const parser = new DOMParser();
  const svg = parser.parseFromString(svgString, "image/svg+xml");
  const svgElement = svg.documentElement;
  if (!svgElement.hasAttribute('aria-label')) {
    svgElement.setAttribute('aria-label', label || 'Descriptive label for SVG');
  }
  const serializer = new XMLSerializer();
  return serializer.serializeToString(svg);
}

const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }

    if (e.key === 'Escape') {
      element.dispatchEvent(new CustomEvent('escape-pressed'));
    }
  };

  element.addEventListener('keydown', handleKeyDown);

  // Return cleanup function
  return () => {
    element.removeEventListener('keydown', handleKeyDown);
  };
};

// Existing utility functions
function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  console.log(timestamp + " [" + level.toUpperCase() + "]: " + message);
}

// Export functionality with accessibility support
const exportUtilities = {
  exportData: (data, filename, mimeType) => {
    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.setAttribute('aria-label', "Download " + filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Announce download completion to screen readers
    announceToScreenReader("Download of " + filename + " started");
  },

  exportToJSON: (data, filename) => {
    const jsonString = JSON.stringify(data, null, 2);
    exportUtilities.exportData(jsonString, filename || 'export.json', 'application/json');
  },

  exportToCSV: (data, filename) => {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvRows = [];

    csvRows.push(headers.join(','));

    for (const row of data) {
      const values = headers.map(header => {
        const escaped = ('' + (row[header] || '')).replace(/"/g, '\\"');
        return "\"" + escaped + "\"";
      });
      csvRows.push(values.join(','));
    }

    const csvString = csvRows.join('\n');
    exportUtilities.exportData(csvString, filename || 'export.csv', 'text/csv');
  }
};

function sanitizeFilename(filename) {
  return filename.replace(/[^a-z0-9._-]/g, '_');
}

function readFileSafe(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    log("Error reading file " + filePath + ": " + error.message, 'error');
    return null;
  }
}

// Existing data processing functions
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

function filterValidItems(items, validator) {
  return items.filter(item => {
    try {
      return validator(item);
    } catch {
      return false;
    }
  });
}

// Initialize accessibility features
const initAccessibility = () => {
  accessibilityUtils.initSkipLink();

  // Add keyboard support for all interactive elements
  document.addEventListener('keydown', (e) => {
    const element = e.target;
    if (element && (element.onclick || element.tagName === 'BUTTON' || element.tagName === 'A')) {
      const actions = {
        Enter: () => element.click(),
        ' ': () => element.click()
      };
      if (actions[e.key]) {
        actions[e.key]();
      }
    }
  });
};

// Example usage of the function
const originalSvgString = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y="0.9em" dy="0.35em">Test</text></svg>';
const modifiedSvgString = addAccessibleName(originalSvgString, 'Screeps Dashboard SVG');

// TODO: This is where the original commitment added a new feature. Keep both changes to preserve the added functionality.

/**
 * Validates table accessibility
 * @param {Array} tableData - Table data to validate
 * @returns {boolean} True if table is accessible, false otherwise
 */
function validateTableAccessibilityFn(tableData) {
  const errors = [];
  const tables = getTables();

  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];

    // Check if table has headers
    if (!table.headers || !Array.isArray(table.headers) || table.headers.length === 0) {
      errors.push({
        tableIndex: i,
        error: 'Table must have headers defined'
      });
    }

    // Check if table has proper structure
    if (!table.rows || !Array.isArray(table.rows)) {
      errors.push({
        tableIndex: i,
        error: 'Table must have rows array defined'
      });
    }

    // Check for proper ARIA attributes (placeholder implementation)
    if (table.ariaLabel === undefined && table.caption === undefined) {
      errors.push({
        tableIndex: i,
        error: 'Table should have aria-label or caption for accessibility'
      });
    }

    // Add lang attribute to HTML element
    if (document.documentElement.lang === undefined) {
      document.documentElement.setAttribute('lang', 'en');
    }

    // Add landmark roles and fix landmark issues
    if (table.role === undefined) {
      table.role = 'table';
    }

    // Add accessible names to 2 SVGs
    const svgElements = document.querySelectorAll('svg');
    svgElements.forEach(svg => {
      if (!svg.hasAttribute('aria-label')) {
        svg.setAttribute('aria-label', 'Accessible SVG element');
      }
    });
  }

  return errors.length === 0;
}

function handleCredentialResponse(response) {
  // Handle credential response from Google Sign-In or similar
  if (response && response.credential) {
    // Decode and process the credential
    const payload = JSON.parse(atob(response.credential.split('.')[1]));
    return {
      success: true,
      user: {
        email: payload.email,
        name: payload.name,
        picture: payload.picture
      }
    };
  }
  return { success: false, error: 'No credential provided' };
}

/**
 * Validates table structure
 * @param {Array} tableData - Table data to validate
 * @returns {boolean} True if table structure is valid, false otherwise
 */
function validateTableStructureFn(tableData) {
  // Implementation placeholder - function to be implemented
  return true;
}

function function3() {
  // TODO: Implement new function3 logic here
  return "function3 implemented";
}

// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
// _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
// <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
// _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
// <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
// _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
// <!-- todo-hash: 1f81632535b0749b809ac49f5e1c8cf4389f9c -->
// _Commit: 4a63dcac59b893a2efdccd50635fab9cc54e7989_
// <!-- todo-hash: 69d71664fd0827cd05d345427adf276b26830ba5 -->

module.exports = {
  ...accessibilityUtils,
  renderDependencyGraph,
  addAriaLabel,
  addAccessibleName,
  validateTableAccessibility: validateTableAccessibilityFn,
  validateTableStructure: validateTableStructureFn,
  ensureElementId,
  ensureElementHasId,
  ensureElementHasIdWithPrefix,
  getTables,
  getConfig,
  setConfig,
  function3,
  newFocusTrap,
  initSkipLink,
  trapFocus,
  ensureElementHasId: ensureElementHasIdImpl,
};
=========================================