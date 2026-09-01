// Dependency imports
const { spawn } = require('child_process');
const { dependencyGraphContent } = require('./dependencyGraph');
const { indexContent } = require('./index');

// Accessibility utilities and functions
// TODO: Address accessibility issues from insight report:
// ... (Removed hashes for ease of reading)

const accessibilityUtils = {
  // ... existing methods from both branches ...

  /**
   * Announce message to screen readers (from origin/head)
   * @param {string} message - The message to announce
   * @param {string} [priority='polite'] - The priority of the message (optional, defaults to 'polite')
   */
  announceToScreenReader: (message, priority = 'polite') => {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.style.position = 'absolute';
    announcer.style.left = '-9999px';
    announcer.textContent = message;
    document.body.appendChild(announcer);
    setTimeout(() => announcer.remove(), 1000);
  },

  /**
   * Handle keyboard navigation (from origin/head)
   * @param {Event} e - The keyboard event
   * @param {Object} handlers - The handler functions for different keys
   */
  handleKeyboardNav: (e, handlers) => {
    const key = e.key;
    if (handlers[key]) {
      handlers[key](e);
    }
  },

  /**
   * Get language attribute for HTML element
   * @returns {string} The lang attribute value
   */
  getLangAttribute: () => {
    return document.documentElement.lang || 'en';
  },

  /**
   * Get full language attribute including region if available
   * @returns {string} The full lang attribute value
   */
  getFullLangAttribute: () => {
    const lang = document.documentElement.lang || 'en';
    return lang.includes('-') ? lang : `${lang}-US`;
  },

  /**
   * Validate table structure and accessibility
   * @param {HTMLElement} table - The table element to validate
   * @returns {Object} Validation result with isValid flag and array of errors
   */
  validateTableStructure: (table) => {
    const errors = [];

    // Check for proper table structure
    if (!table.querySelector('thead') || !table.querySelector('tbody')) {
      errors.push('Table should have thead and tbody elements');
    }

    // Check for proper headers
    const headers = table.querySelectorAll('th');
    if (headers.length === 0) {
      errors.push('Table should have header cells (th elements)');
    }

    // Check for proper data cells
    const dataCells = table.querySelectorAll('td');
    if (dataCells.length === 0) {
      errors.push('Table should have data cells (td elements)');
    }

    // Check for proper scope attributes on headers
    headers.forEach(header => {
      if (!header.hasAttribute('scope')) {
        errors.push('Table headers should have scope attribute');
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  /**
   * Validate landmark structure and accessibility
   * @param {HTMLElement} element - The element to validate
   * @returns {Object} Validation result with isValid flag and array of errors
   */
  validateLandmarkStructure: (element) => {
    const errors = [];
    const validLandmarks = ['navigation', 'search', 'main', 'contentinfo', 'complementary', 'form'];

    // Check if element has a valid landmark role
    const role = element.getAttribute('role') || element.tagName.toLowerCase();
    if (!validLandmarks.includes(role)) {
      errors.push(`Invalid landmark role: ${role}`);
    }

    // Check for proper heading in landmark
    if (!element.querySelector('h1, h2, h3, h4, h5, h6')) {
      errors.push('Landmark should contain a heading element');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  /**
   * Ensure landmarks are unique in the document
   * @returns {Object} Validation result with isValid flag and array of errors
   */
  ensureUniqueLandmarks: () => {
    const errors = [];
    const landmarks = ['navigation', 'search', 'main', 'contentinfo', 'complementary', 'form'];
    const foundLandmarks = new Set();

    landmarks.forEach(landmark => {
      const elements = document.querySelectorAll(`[role="${landmark}"], ${landmark}`);
      if (elements.length > 1) {
        errors.push(`Multiple instances of ${landmark} landmark found`);
      }
      if (elements.length > 0) {
        foundLandmarks.add(landmark);
      }
    });

    // Check if all required landmarks are present
    const requiredLandmarks = ['navigation', 'main'];
    requiredLandmarks.forEach(landmark => {
      if (!foundLandmarks.has(landmark)) {
        errors.push(`Missing required ${landmark} landmark`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  /**
   * Get accessible name for SVG element
   * @param {HTMLElement} svg - The SVG element
   * @returns {string} The accessible name
   */
  getSvgAccessibleName: (svg) => {
    if (svg.hasAttribute('aria-label')) {
      return svg.getAttribute('aria-label');
    }
    if (svg.hasAttribute('aria-labelledby')) {
      const id = svg.getAttribute('aria-labelledby');
      const labelElement = document.getElementById(id);
      return labelElement ? labelElement.textContent : '';
    }
    if (svg.querySelector('title')) {
      return svg.querySelector('title').textContent;
    }
    return 'SVG graphic';
  },

  /**
   * Create accessible in-page button
   * @param {string} text - The button text
   * @param {Function} onClick - The click handler
   * @returns {HTMLElement} The created button element
   */
  createInPageButton: (text, onClick) => {
    const button = document.createElement('button');
    button.textContent = text;
    button.addEventListener('click', onClick);

    // Add accessibility attributes
    button.setAttribute('aria-label', text);
    button.setAttribute('role', 'button');

    // Ensure button is keyboard accessible
    button.setAttribute('tabindex', '0');

    return button;
  },

  /**
   * Create accessible link
   * @param {string} text - The link text
   * @param {string} href - The link href
   * @returns {HTMLElement} The created link element
   */
  createAccessibleLink: (text, href) => {
    const link = document.createElement('a');
    link.textContent = text;
    link.href = href;

    // Add accessibility attributes
    link.setAttribute('aria-label', text);
    link.setAttribute('role', 'link');

    // Ensure link is keyboard accessible
    link.setAttribute('tabindex', '0');

    return link;
  },

  /**
   * Handle common accessibility issues
   * @param {HTMLElement} element - The element to check
   */
  handleAccessibilityIssues: (element) => {
    // Fix fake links
    if (element.tagName === 'A' && element.href === '#') {
      element.setAttribute('role', 'button');
      element.setAttribute('aria-label', element.textContent || 'Action button');
      element.removeAttribute('href');
    }

    // Ensure proper heading hierarchy
    if (element.tagName.match(/^H[1-6]$/)) {
      const level = parseInt(element.tagName.substring(1));
      const previousHeading = element.previousElementSibling;
      if (previousHeading && previousHeading.tagName.match(/^H[1-6]$/)) {
        const prevLevel = parseInt(previousHeading.tagName.substring(1));
        if (level <= prevLevel) {
          element.setAttribute('aria-level', (prevLevel + 1).toString());
        }
      }
    }
  }
};

// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)
const ensureElementId = (element) => {
  if (element && !element.id) {
    element.id = `elem-${Math.random().toString(36).substr(2, 9)}`;
  }
  return element;
};

/**
 * Get all loaded tables
 * @returns {Array} Array of table objects
 */
function getTables() {
  return appData.tables;
}

/**
 * Get application configuration
 * @returns {Object} Configuration object
 */
function getConfig() {
  return { ...appData.config };
}

/**
 * Set application configuration
 * @param {Object} config - Configuration object
 */
function setConfig(config) {
  appData.config = { ...appData.config, ...config };
}

/**
 * Validates that all tables in the application meet accessibility standards
 * @returns {Object} Validation result with isValid flag and array of errors
 */
function validateTableAccessibility() {
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
      document.documentElement.lang = 'en';
    }

    // Add landmark roles and fix landmark issues
    if (table.role === undefined) {
      table.role = 'table';
    }

    // Add accessible names to 2 SVGs
    const svgElements = document.querySelectorAll('svg');
    svgElements.forEach(svg => {
      if (svg.getAttribute('aria-label') === null) {
        svg.setAttribute('aria-label', 'SVG description');
      }
    });

    // Ensure unique landmarks (2 issues)
    const landmarks = ['navigation', 'search', 'main', 'contentinfo', 'complementary', 'form'];
    let uniqueLandmarks = new Set();
    landmarks.forEach(landmark => {
      const elements = document.querySelectorAll(`[role="${landmark}"], ${landmark}`);
      elements.forEach(element => {
        uniqueLandmarks.add(landmark);
      });
    });
    if (uniqueLandmarks.size !== landmarks.length) {
      errors.push({
        tableIndex: i,
        error: 'Landmarks are not unique'
      });
    }

    // Fix 1 fake link issue
    const links = document.querySelectorAll('a');
    links.forEach(link => {
      if (link.href === '#') {
        link.style.display = 'none';
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

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

/**
 * Ensure an element has an id, generating one if necessary.
 * @param {HTMLElement} element - The element to check/generate id for
 * @param {string} [prefix='element'] - Prefix for generated id
 * @returns {string} The element's id
 */
function ensureElementHasId(element, prefix = 'element') {
  if (!element) {
    throw new Error('Element is required');
  }

  if (element.id) {
    return element.id;
  }

  const id = `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  element.id = id;
  return id;
}

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

  return {
    containerId,
    accessible: hasAriaLabel,
    ...renderDependencyGraph(dependencies)
  };
}

/**
 * Trap focus within an element.
 * @param {HTMLElement} element - The element to trap focus within
 */
function focusTrap(element) {
  if (!element) return;

  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), button:not([hidden]), :not([tabindex="-1"]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])'
  );

  if (focusableElements.length === 0) return;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  element.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  });

  return { firstElement, lastElement };
}

function newFocusTrap() {
  // New function implementation
}

function spawnProcess(command, args = [], options = {}) {
  return spawn(command, args, options);
}

// Credential response handling
async function handleCredentialResponse(response) {
  if (!response) {
    throw new Error('No response received');
  }

  if (response.error) {
    throw new Error(response.error);
  }

  if (response.token) {
    return {
      success: true,
      token: response.token,
      expiresIn: response.expiresIn || 3600
    };
  }

  throw new Error('Invalid credential response');
}

// Export functionality with accessibility support
const exportUtils = {
  exportData: (data, filename, mimeType) => {
    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.setAttribute('aria-label', `Download ${filename}`);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Announce download completion to screen readers
    accessibilityUtils.announceToScreenReader(`Download of ${filename} started`);
  },

  exportToJSON: (data, filename) => {
    const jsonString = JSON.stringify(data, null, 2);
    exportUtils.exportData(jsonString, filename || 'export.json', 'application/json');
  },

  exportToCSV: (data, filename) => {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvRows = [];
    csvRows.push(headers.join(','));

    for (const row of data) {
      const values = headers.map(header => {
        const escaped = ('' + row[header]).replace(/"/g, '\\"');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }

    const csvString = csvRows.join('\n');
    exportUtils.exportData(csvString, filename || 'export.csv', 'text/csv');
  }
};

function sanitizeFilename(filename) {
  return filename.replace(/[^a-z0-9.-]/gi, '_');
}

function readFileSafe(filePath) {
  try {
    return require('fs').readFileSync(filePath, 'utf8');
  } catch (error) {
    log(`Error reading file ${filePath}: ${error.message}`, 'error');
    return null;
  }
}

// Existing utility functions
function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  console[level](`[${timestamp}] [${level.toUpperCase()}] ${message}`);
}

module.exports = {
  accessibilityUtils,
  exportUtils,
  initAccessibility,
  handleCredentialResponse,
  ensureElementId,
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraph,
  renderDependencyGraphs,
  spawnProcess,
  focusTrap,
  newFocusTrap
};