/**
 * Main application entry point
 */

// Import required modules
const http = require('http');
const path = require('path');

// TODO: This is the existing code that needs to be preserved

// Application configuration
const config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development'
};

/**
 * Creates and starts the HTTP server
 * @returns {http.Server} The created server instance
 */
function createServer() {
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', config }));
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

/**
 * Gets the language attribute value for the HTML element
 * @returns {string} The language attribute value
 */
function getLangAttribute() {
  return 'en';
}

/**
 * Gets a person's name with accessibility support
 * @param {Object} person - Person object with name properties
 * @returns {string} Accessible person name
 */
function personName(person) {
  if (!person) return '';
  return `${person.firstName || ''} ${person.lastName || ''}`.trim();
}

/**
 * Validates table accessibility compliance
 * @param {Array} tables - Array of table elements to validate
 * @returns {Object} Validation result with issues
 */
function validateTableAccessibility(tables) {
  const issues = [];
  tables.forEach((table, index) => {
    if (!table.headers) {
      issues.push({ table: index, issue: 'Missing headers attribute' });
    }
  });
  return { valid: issues.length === 0, issues };
}

/**
 * Validates table structure for accessibility
 * @param {Object} table - Table element to validate
 * @returns {Object} Validation result
 */
function validateTableStructure(table) {
  const issues = [];
  if (!table.caption && !table.summary) {
    issues.push('Table missing caption or summary');
  }
  return { valid: issues.length === 0, issues };
}

/**
 * Validates landmark elements for accessibility
 * @param {Array} landmarks - Array of landmark elements
 * @returns {Object} Validation result
 */
function validateLandmark(landmarks) {
  const issues = [];
  const seenRoles = new Set();
  landmarks.forEach((landmark) => {
    if (!landmark.role) {
      issues.push({ issue: 'Missing landmark role', landmark });
    }
  });
  return { valid: issues.length === 0, issues };
}

/**
 * Validates landmark structure for accessibility
 * @param {Array} landmarks - Array of landmark elements
 * @returns {Object} Validation result
 */
function validateLandmarkStructure(landmarks) {
  const issues = [];
  const seenRoles = new Map();
  landmarks.forEach((landmark, index) => {
    const role = landmark.role;
    if (role) {
      if (seenRoles.has(role)) {
        const existingIndices = seenRoles.get(role);
        const uniqueLandmarks = [...new Set([...existingIndices, index])];
        if (uniqueLandmarks.length > 1 && !['navigation', 'complementary'].includes(role)) {
          issues.push({ role, indices: uniqueLandmarks, issue: 'Duplicate landmark role without unique labeling' });
        }
        seenRoles.set(role, uniqueLandmarks);
      } else {
        seenRoles.set(role, [index]);
      }
    }
  });
  return { valid: issues.length === 0, issues };
}

/**
 * Gets accessible name for SVG element
 * @param {Object} svg - SVG element
 * @returns {string} Accessible name for the SVG
 */
function getSvgAccessibleName(svg) {
  if (!svg) return '';
  return svg.title || svg.getAttribute('aria-label') || '';
}

/**
 * Creates an accessible in-page button
 * @param {Object} options - Button options
 * @returns {Object} Button element with accessibility attributes
 */
function createInPageButton(options = {}) {
  const { text, href, id } = options;
  return {
    type: href ? 'link' : 'button',
    id: id || `button-${Date.now()}`,
    text,
    accessibleText: text,
    href,
    role: href ? 'link' : 'button',
    tabIndex: 0
  };
}

/**
 * Implements focus trap for keyboard navigation
 * @param {HTMLElement} container - Container element to trap focus within
 * @param {Object} options - Focus trap options
 * @returns {Object} Focus trap controller
 */
function newFocusTrap(container, options = {}) {
  const focusableSelectors = options.selectors || [
    'button:not([disabled])',
    'a[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ];

  const getFocusableElements = () => {
    if (!container) return [];
    return Array.from(container.querySelectorAll(focusableSelectors.join(',')));
  };

  const handleKeyDown = (event) => {
    if (event.key !== 'Tab') return;
    
    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  const activate = () => {
    if (container) {
      container.addEventListener('keydown', handleKeyDown);
      const focusableElements = getFocusableElements();
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }
  };

  const deactivate = () => {
    if (container) {
      container.removeEventListener('keydown', handleKeyDown);
    }
  };

  return {
    activate,
    deactivate,
    updateContainer: (newContainer) => {
      container = newContainer;
    }
  };
}

// Export functions for testing
module.exports = {
  createServer,
  startApp,
  config,
  getLangAttribute,
  personName,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  createInPageButton,
  newFocusTrap
};

// Start the application if run directly
if (require.main === module) {
  startApp();
}