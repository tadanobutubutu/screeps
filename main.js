// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
// TODO: Import required module(s) and export the new necessary function(s) here in main.js (preserving the original code)
const main = require('./utilities');

const { createInPageButton, validateTableAccessibility, validateTableStructure, validateLandmark, validateLandmarkStructure, getSvgAccessibleName, getLangAttribute, validateAccessibilityReport, exportUtils, addressAccessibilityIssues, handleCredentialResponse, ensureElementHasId, ensureElementHasIdOrigin, renderDependencyGraphs, fixButtonIdentifiers, fixDependencyGraphAria, addMainLandmarkToIndex, focusTrap, renderAdditionalContent } = main;

// Utility functions for ensuring elements have IDs and adding labels
const ensureElementId = (element) => {
  if (element && !element.id) {
    element.id = `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  return element;
};

// Accessibility utilities and functions
// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...)
// - REACT_036: Fix 1 fake link issue (handled by ... createInPageButton(), ... and personName())
// - ADD: Address new accessibility issues from insight report
// - NEW: Implement a new function to handle focus trap for keyboard navigation (handled by newFocusTrap())

const accessibilityUtils = {
  // Initialize skip link functionality for keyboard navigation
  initSkipLink: () => {
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(skipLink.getAttribute('href'));
        if (target) {
          target.setAttribute('tabindex', '-1');
          target.focus();
        }
      });
    }
  },

  // Trap focus within an element (for modals, dialogs)
  trapFocus: (element) => {
    const focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
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
  },

  // TODO: Import the new function to create a button with correct accessibility properties for in-page linking
  createInPageButton: createInPageButton,

  // TODO: Create a utility function to create a web resource button suitable for accessibility (e.g., Github, Stack Overflow, etc.)
  createWebResourceButton: (options) => {
    const { href, text, ariaLabel, icon, className = '' } = options;

    if (!href || !text) {
      throw new Error('href and text are required for web resource button');
    }

    const button = document.createElement('a');
    button.href = href;
    button.textContent = text;
    button.className = `web-resource-button ${className}`;
    button.setAttribute('role', 'button');
    button.setAttribute('tabindex', '0');

    if (ariaLabel) {
      button.setAttribute('aria-label', ariaLabel);
    }

    if (icon) {
      const iconElement = document.createElement('span');
      iconElement.className = 'icon';
      iconElement.textContent = icon;
      button.insertBefore(iconElement, button.firstChild);
    }

    // Add keyboard support
    button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.location.href = href;
      }
    });

    return button;
  },

  // TODO: Validate the table structure for accessibility issues
  validateTableAccessibility,
  validateTableStructure,

  // TODO: Validate the landmark structure for accessibility issues
  validateLandmark,
  validateLandmarkStructure,

  // TODO: Extract the accessible name for an SVG from its content
  getSvgAccessibleName,

  // TODO: Add a language attribute to the HTML element
  getLangAttribute,

  // TODO: Validate the accessibility report for issues
  validateAccessibilityReport,

  // TODO: Address new accessibility issues from insight report ( implement new functions and fixes as needed)

  // Credential response handling
  handleCredentialResponse: async function(response) {
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
  },

  // Announce message to screen readers
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

  // Handle keyboard navigation
  handleKeyboardNav: (e, handlers) => {
    const key = e.key;
    if (handlers[key]) {
      handlers[key](e);
    }
  },

  // New focus trap function for keyboard navigation
  newFocusTrap: (element) => {
    if (!element) {
      return () => {};
    }

    const focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) {
      return () => {};
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

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
        element.dispatchEvent(new CustomEvent('focusTrapEscape'));
      }
    };

    element.addEventListener('keydown', handleKeyDown);
    firstElement.focus();

    // Return cleanup function
    return () => {
      element.removeEventListener('keydown', handleKeyDown);
    };
  },

  // Export functionality with accessibility support
  exportUtils
};

// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)

const ensureElementHasId = (element) => {
  if (element && !element.id) {
    element.id = "element-" + Date.now() + "-" + Math.random().toString(36).slice(2, 11);
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

// Add back any required exports that might have been removed.
// For example, if the issue requires adding back an export like `calculateSum`, you would add:
function calculateSum(a, b) { return a + b; }

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
    accessibilityUtils.announceToScreenReader("Download of " + filename + " started");
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
        const escaped = ('' + row[header]).replace(/"/g, '\\"');
        return "\"" + escaped + "\"";
      });
      csvRows.push(values.join(','));
    }

    const csvString = csvRows.join('\n');
    exportUtilities.exportData(csvString, filename || 'export.csv', 'text/csv');
  }
};

function sanitizeFilename(filename) {
  return filename.replace(/[^a-z0-9_.-]/gi, '_');
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
  document.querySelectorAll('[data-accessible]').forEach(element => {
    element.addEventListener('keydown', (e) => {
      accessibilityUtils.handleKeyboardNav(e, {
        Enter: () => element.click(),
        ' ': () => element.click()
      });
    });
  });
};

function groupByCategory(items, getCategory) {
  return items.reduce((groups, item) => {
    const category = getCategory(item);
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {});
}

// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
// _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
// <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
// _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
// <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
// _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
// <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->

_Commit: b8888a21083c89f599fb68eef1dc4d5df1051e52_

<!-- todo-hash: 2940d94829911b172237e001ec7271ce7347833e -->

// TODO: Implement the new function as per the issue requirements
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

  const processValue = (value) => {
    if (typeof value === 'string') {
      let processed = value;
      if (trimWhitespace) {
        processed = processed.trim();
      }
      if (uppercase) {
        processed = processed.toUpperCase();
      }
      if (maxLength !== null && processed.length > maxLength) {
        processed = processed.substring(0, maxLength);
      }
      return processed;
    }
    return value;
  };

  if (typeof inputData === 'object' && !Array.isArray(inputData) && inputData !== null) {
    const result = {};
    const keys = preserveKeys ? Object.keys(inputData) : Object.keys(inputData).map(() => Math.random().toString(36).substr(2, 9));

    let i = 0;
    for (const key of Object.keys(inputData)) {
      const value = inputData[key];
      if (typeof value === 'object' && value !== null) {
        result[keys[i]] = transformInputData(value, options);
      } else {
        result[keys[i]] = processValue(value);
      }
      i++;
    }
    return result;
  }

  if (Array.isArray(inputData)) {
    return inputData.map((item) => {
      if (typeof item === 'object' && item !== null) {
        return transformInputData(item, options);
      }
      return processValue(item);
    });
  }

  return processValue(inputData);
}

// New accessibility functions for insight report issues

/**
 * Get lang attribute for HTML element - REACT_015
 * @param {string} locale - The locale code (e.g., 'en', 'es', 'fr')
 * @returns {string} The lang attribute value
 */
function getLangAttribute(locale = 'en') {
  if (!locale) return 'en';
  return locale.split('-')[0].toLowerCase();
}

/**
 * Format person name for accessibility - REACT_015, REACT_036
 * @param {Object} person - Person object with firstName, lastName, middleName
 * @returns {string} Formatted full name
 */
function personName(person) {
  if (!person) return '';
  const parts = [];
  if (person.firstName) parts.push(person.firstName);
  if (person.middleName) parts.push(person.middleName);
  if (person.lastName) parts.push(person.lastName);
  return parts.join(' ').trim();
}

/**
 * Validate table structure - REACT_027
 * @param {HTMLTableElement} tableElement - The table element to validate
 * @returns {Array<string>} Array of validation issues
 */
function validateTableStructure(tableElement) {
  const issues = [];

  if (!tableElement || tableElement.tagName.toLowerCase() !== 'table') {
    issues.push('Element is not a TABLE element');
    return issues;
  }

  // Check for proper table structure with thead, tbody, tfoot
  const thead = tableElement.querySelector('thead');
  const tbody = tableElement.querySelector('tbody');
  const tfoot = tableElement.querySelector('tfoot');

  if (!thead) {
    issues.push('TABLE is missing a THEAD section');
  }

  if (!tbody && !tableElement.querySelector('tr')) {
    issues.push('TABLE has no data rows (TBODY or direct TR children)');
  }

  // Check for scope attributes on header cells
  const headers = tableElement.querySelectorAll('th');
  headers.forEach((th, index) => {
    if (!th.hasAttribute('scope')) {
      issues.push(`TH at index ${index} is missing scope attribute (should be 'col', 'row', 'colgroup', or 'rowgroup')`);
    }
  });

  // Check for header IDs and data cell headers attributes (complex tables)
  const hasHeadersAttr = tableElement.querySelector('td[headers]');
  if (hasHeadersAttr) {
    const headerIds = new Set();
    tableElement.querySelectorAll('th[id]').forEach(th => headerIds.add(th.id));

    tableElement.querySelectorAll('td[headers]').forEach(td => {
      const headersList = td.getAttribute('headers').split(/\s+/);
      headersList.forEach(id => {
        if (!headerIds.has(id)) {
          issues.push(`TD references non-existent header ID: ${id}`);
        }
      });
    });
  }

  return issues;
}

/**
 * Validate landmark structure - REACT_017
 * @param {HTMLElement} element - The element to validate as a landmark
 * @returns {Array<string>} Array of validation issues
 */
function validateLandmark(element) {
  const issues = [];

  if (!element) {
    issues.push('Element is required');
    return issues;
  }

  const landmarkRoles = [
    'banner', 'complementary', 'contentinfo', 'form',
    'main', 'navigation', 'region', 'search'
  ];

  const role = element.getAttribute('role');
  const tagName = element.tagName.toLowerCase();

  // Check if element is a landmark
  const isLandmark = landmarkRoles.includes(role) ||
    (tagName === 'main') ||
    (tagName === 'nav') ||
    (tagName === 'aside') ||
    (tagName === 'header') ||
    (tagName === 'footer') ||
    (tagName === 'form') ||
    (tagName === 'section' && element.hasAttribute('aria-label')) ||
    (tagName === 'section' && element.hasAttribute('aria-labelledby'));

  if (!isLandmark) {
    issues.push('Element is not a recognized landmark');
  }

  // Check for accessible name on region landmarks
  if (role === 'region' || tagName === 'section') {
    if (!element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
      issues.push('Region/section landmark must have an accessible name (aria-label or aria-labelledby)');
    }
  }

  // Check for duplicate landmarks of certain types
  const uniqueLandmarks = ['main', 'banner', 'contentinfo'];
  if (uniqueLandmarks.includes(role) || uniqueLandmarks.includes(tagName)) {
    const existing = document.querySelectorAll(`[role="${role}"], ${tagName}`);
    if (existing.length > 1) {
      issues.push(`Multiple ${role || tagName} landmarks found - should be unique`);
    }
  }

  return issues;
}

/**
 * Validate landmark structure across document - REACT_017
 * @returns {Array<string>} Array of validation issues
 */
function validateLandmarkStructure() {
  const issues = [];

  // Check for main landmark
  const mainLandmarks = document.querySelectorAll('main, [role="main"]');
  if (mainLandmarks.length === 0) {
    issues.push('Document is missing a main landmark');
  } else if (mainLandmarks.length > 1) {
    issues.push('Document has multiple main landmarks');
  }

  // Check for banner landmark
  const bannerLandmarks = document.querySelectorAll('header[role="banner"], [role="banner"]');
  if (bannerLandmarks.length > 1) {
    issues.push('Document has multiple banner landmarks');
  }

  // Check for contentinfo landmark
  const contentinfoLandmarks = document.querySelectorAll('footer[role="contentinfo"], [role="contentinfo"]');
  if (contentinfoLandmarks.length > 1) {
    issues.push('Document has multiple contentinfo landmarks');
  }

  // Check all region landmarks have accessible names
  const regions = document.querySelectorAll('[role="region"], section');
  regions.forEach((region, index) => {
    if (!region.hasAttribute('aria-label') && !region.hasAttribute('aria-labelledby')) {
      issues.push(`Region landmark at index ${index} is missing accessible name`);
    }
  });

  // Check navigation landmarks
  const navLandmarks = document.querySelectorAll('nav, [role="navigation"]');
  navLandmarks.forEach((nav, index) => {
    if (navLandmarks.length > 1 && !nav.hasAttribute('aria-label') && !nav.hasAttribute('aria-labelledby')) {
      issues.push(`Navigation landmark at index ${index} should have accessible name when multiple exist`);
    }
  });

  return issues;
}

/**
 * Get accessible name for SVG elements - REACT_041
 * @param {SVGElement} svgElement - The SVG element
 * @returns {string} The accessible name
 */
function getSvgAccessibleName(svgElement) {
  if (!svgElement) return '';

  // Check for aria-label
  if (svgElement.hasAttribute('aria-label')) {
    return svgElement.getAttribute('aria-label');
  }

  // Check for aria-labelledby
  if (svgElement.hasAttribute('aria-labelledby')) {
    const id = svgElement.getAttribute('aria-labelledby');
    const labelElement = document.getElementById(id);
    if (labelElement) {
      return labelElement.textContent.trim();
    }
  }

  // Check for <title> child
  const title = svgElement.querySelector('title');
  if (title && title.textContent.trim()) {
    return title.textContent.trim();
  }

  // Check for <desc> child
  const desc = svgElement.querySelector('desc');
  if (desc && desc.textContent.trim()) {
    return desc.textContent.trim();
  }

  return '';
}

/**
 * Create an accessible in-page button (not a fake link) - REACT_036
 * @param {Object} options - Button options
 * @param {string} options.text - Button text
 * @param {Function} options.onClick - Click handler
 * @param {string} [options.ariaLabel] - Accessible label
 * @param {string} [options.className] - CSS class
 * @returns {HTMLButtonElement} The created button element
 */
function createInPageButton(options) {
  const { text, onClick, ariaLabel, className = '' } = options;

  if (!text || typeof onClick !== 'function') {
    throw new Error('Button text and onClick handler are required');
  }

  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = text;
  button.className = className;

  if (ariaLabel) {
    button.setAttribute('aria-label', ariaLabel);
  }

  button.addEventListener('click', onClick);

  // Add keyboard support
  button.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(e);
    }
  });

  return button;
}

// Initialize on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccessibility);
  } else {
    initAccessibility();
  }
}

// New function: validateTableAccessibility
function validateTableAccessibility(tableElement) {
  const issues = [];

  if (!tableElement || tableElement.tagName.toLowerCase() !== 'table') {
    issues.push('Element is not a TABLE element');
    return issues;
  }

  // Check for presence of <caption> (accessibility best practice for table description)
  const caption = tableElement.querySelector('caption');
  if (!caption || !caption.textContent.trim()) {
    issues.push('TABLE is missing a descriptive caption');
  }

  // Check that all rows have consistent number of cells
  const rows = Array.from(tableElement.querySelectorAll('tr'));
  let expectedCellCount = null;

  rows.forEach((row, rowIndex) => {
    const cells = Array.from(row.children).filter(
      child => ['TH', 'TD'].includes(child.tagName.toUpperCase())
    );
    if (expectedCellCount === null) {
      expectedCellCount = cells.length;
    } else if (cells.length !== expectedCellCount) {
      issues.push(`Row ${rowIndex} has ${cells.length} cells, expected ${expectedCellCount}`);
    }
  });

  return issues;
}

// Toolbox original functions
function getTables() {
  return appData.tables;
}

function getConfig() {
  return { ...appData.config };
}

function setConfig(config) {
  appData.config = { ...appData.config, ...config };
}

// Required changes to fix the React SVG Accessible Name issue
function addAccessibleName(svgString) {
  // This function adds an `aria-label` attribute to the SVG if it doesn't already have one
  // and returns the modified SVG string.
  // Note: This is a simplified example and might need adjustments based on the actual SVG structure.
  const svg = new DOMParser().parseFromString(svgString, "image/svg+xml");
  const svgElement = svg.documentElement;
  if (!svgElement.getAttribute('aria-label')) {
    svgElement.setAttribute('aria-label', 'Descriptive label for SVG');
  }
  return new XMLSerializer().serializeToString(svg);
}

// Example usage of the function
const originalSvgString = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y="0.9em" font-size="90">🐛</text></svg>';
const modifiedSvgString = addAccessibleName(originalSvgString);

module.exports = {
  ...main,
  ...accessibilityUtils,
  ensureElementId,
  ensureElementHasId,
  newFocusTrap,
  log,
  sanitizeFilename,
  readFileSafe,
  processData,
  filterValidItems,
  groupByCategory,
  transformInputData,
  validateTableAccessibility,
  // New accessibility functions
  getLangAttribute,
  personName,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  createInPageButton,
  getTables,
  getConfig,
  setConfig,
  addAccessibleName,
  renderAdditionalContent,
  renderDependencyGraph
};
// Here, the functions `getTables` and `setConfig` have been moved into the main export from the conflicting changes with the `main` object, and the `renderDependencyGraph` function has been moved back as well. The new function `renderAdditionalContent` has also been added to the exports. All the functions related to accessibility improvements are kept in the `accessibilityUtils` object. This should resolve the Git merge conflict in a meaningful and logical manner.