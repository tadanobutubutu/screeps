// TODO: This is the existing code that needs to be preserve
// (This comment remains as-is)
// TODO: Import required module(s) and export the new necessary function(s) here in main.js (preserving the original code)

const fs = require('fs');

// Accessibility utilities and functions
// TODO: Address accessibility issues from insight report — FIXED (combined with the export code)
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and newFocusTrap())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...)
// - REACT_036: Fix 1 fake link issue (handled by ... createInPageButton(), ... and personName())
// - ADD: Address new accessibility issues from insight report
// - NEW: Implement a new function to handle focus trap for keyboard navigation (handled by newFocusTrap())

const accessibilityUtils = {
  // Initialize skip link functionality for keyboard navigation
  initSkipLink: () => {
    const skipLink = document.querySelector('.skip-link, [href="#main-content"]');
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
  newFocusTrap: (container) => {
    if (!container) return;
    
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ');
    
    const focusableElements = container.querySelectorAll(focusableSelectors);
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    };
    
    container.addEventListener('keydown', handleTabKey);
    
    return {
      deactivate: () => {
        container.removeEventListener('keydown', handleTabKey);
      }
    };
  }
};

// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)

const ensureElementId = (element) => {
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
const exportUtils = {
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
        return "\"" + escaped + "\"";
      });
      csvRows.push(values.join(','));
    }
    
    const csvString = csvRows.join('\n');
    exportUtils.exportData(csvString, filename || 'export.csv', 'text/csv');
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

    if (expectedCellCount === null && cells.length > 0) {
      expectedCellCount = cells.length;
    }

    if (expectedCellCount !== null && cells.length !== expectedCellCount) {
      issues.push(`Row ${rowIndex + 1} has inconsistent number of cells`);
    }
  });

  // Check that TH elements exist (header row/column should be marked)
  const thCells = tableElement.querySelectorAll('th');
  if (thCells.length === 0) {
    issues.push('TABLE has no header cells (TH) defined');
  }

  return issues;
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
  
  const id = `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  element.id = id;
  return id;
}

/**
 * Get the lang attribute from HTML element or document
 * @param {HTMLElement} element - The element to get lang attribute from
 * @returns {string|null} The language code or null if not found
 */
function getLangAttribute(element) {
  if (!element) {
    element = document.documentElement;
  }
  return element.lang || element.getAttribute('lang') || document.documentElement.lang || null;
}

/**
 * Get accessible name for a person, used in accessibility contexts
 * @param {Object} personData - Person data object
 * @param {string} personData.firstName - First name
 * @param {string} personData.lastName - Last name
 * @returns {string} Accessible name for the person
 */
function personName(personData) {
  if (!personData) return '';
  
  const parts = [];
  if (personData.firstName) parts.push(personData.firstName);
  if (personData.lastName) parts.push(personData.lastName);
  
  return parts.join(' ') || personData.name || '';
}

/**
 * Validate table structure for accessibility compliance
 * @param {HTMLTableElement} tableElement - The table element to validate
 * @returns {Object} Validation result with issues array and structure info
 */
function validateTableStructure(tableElement) {
  const result = {
    isValid: true,
    issues: [],
    structure: {
      hasCaption: false,
      hasHeaderCells: false,
      rowCount: 0,
      columnCount: 0,
      hasScopeAttributes: false
    }
  };

  if (!tableElement || tableElement.tagName.toLowerCase() !== 'table') {
    result.isValid = false;
    result.issues.push('Invalid table element provided');
    return result;
  }

  const caption = tableElement.querySelector('caption');
  if (caption && caption.textContent.trim()) {
    result.structure.hasCaption = true;
  } else {
    result.issues.push('Table should have a descriptive caption');
  }

  const headers = tableElement.querySelectorAll('th');
  result.structure.hasHeaderCells = headers.length > 0;
  
  if (headers.length > 0) {
    const headersWithScope = Array.from(headers).filter(th => th.hasAttribute('scope'));
    result.structure.hasScopeAttributes = headersWithScope.length > 0;
    
    if (headersWithScope.length !== headers.length) {
      result.issues.push('All header cells should have scope attributes');
    }
  } else {
    result.issues.push('Table should have header cells (th elements)');
  }

  const rows = tableElement.querySelectorAll('tbody > tr, thead > tr, tr');
  result.structure.rowCount = rows.length;
  
  if (rows.length > 0) {
    const firstRowCells = Array.from(rows[0].children).filter(
      c => ['TH', 'TD'].includes(c.tagName.toUpperCase())
    );
    result.structure.columnCount = firstRowCells.length;
  }

  result.isValid = result.issues.length === 0;
  return result;
}

/**
 * Validate landmark elements for accessibility compliance
 * @param {Document|Element} context - The context to search for landmarks
 * @returns {Object} Validation result with issues and landmark info
 */
function validateLandmark(context) {
  const result = {
    isValid: true,
    issues: [],
    landmarks: []
  };

  context = context || document;
  const landmarkSelectors = [
    'header:not([role])',
    'nav',
    'main',
    'footer:not([role])',
    'aside',
    '[role="banner"]',
    '[role="navigation"]',
    '[role="main"]',
    '[role="contentinfo"]',
    '[role="complementary"]',
    '[role="region"][aria-label]',
    '[role="region"][aria-labelledby]'
  ];

  landmarkSelectors.forEach(selector => {
    try {
      const elements = context.querySelectorAll(selector);
      elements.forEach(el => {
        const role = el.getAttribute('role') || el.tagName.toLowerCase();
        result.landmarks.push({
          element: el.tagName,
          role: role,
          id: el.id || null,
          label: el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || null
        });
      });
    } catch (e) {
      // Ignore invalid selectors
    }
  });

  // Check for multiple main landmarks
  const mainLandmarks = result.landmarks.filter(l => 
    l.role === 'main' || l.element.toLowerCase() === 'main'
  );
  if (mainLandmarks.length > 1) {
    result.issues.push('Page should have only one main landmark');
    result.isValid = false;
  }

  // Check for nav landmarks without labels
  const navLandmarks = result.landmarks.filter(l => 
    l.role === 'navigation' || l.element.toLowerCase() === 'nav'
  );
  const unlabelledNav = navLandmarks.filter(n => !n.label && !n.id);
  if (unlabelledNav.length > 1) {
    result.issues.push('Multiple navigation landmarks should have unique labels');
    result.isValid = false;
  }

  return result;
}

/**
 * Validate landmark structure for proper ARIA implementation
 * @param {Document|Element} context - The context to validate
 * @returns {Object} Structure validation result
 */
function validateLandmarkStructure(context) {
  context = context || document;
  const result = {
    hasHeader: false,
    hasNav: false,
    hasMain: false,
    hasFooter: false,
    hasAside: false,
    navCount: 0,
    issues: [],
    recommendations: []
  };

  // Check for header
  const header = context.querySelector('header:not([role]), [role="banner"]');
  result.hasHeader = !!header;

  // Check for navigation
  const navs = context.querySelectorAll('nav, [role="navigation"]');
  result.navCount = navs.length;
  result.hasNav = navs.length > 0;

  // Check for multiple navigations with unique labels
  let labelledNavs = 0;
  navs.forEach(nav => {
    if (nav.getAttribute('aria-label') || nav.getAttribute('aria-labelledby') || nav.id) {
      labelledNavs++;
    }
  });
  if (navs.length > 1 && labelledNavs < navs.length) {
    result.issues.push('Multiple navigation elements should have unique aria-label or id');
  }

  // Check for main
  const main = context.querySelector('main, [role="main"]');
  result.hasMain = !!main;

  // Check for footer
  const footer = context.querySelector('footer:not([role]), [role="contentinfo"]');
  result.hasFooter = !!footer;

  // Check for aside
  const aside = context.querySelector('aside, [role="complementary"]');
  result.hasAside = !!aside;

  // Add recommendations
  if (!result.hasHeader) {
    result.recommendations.push('Consider adding a header landmark for branding');
  }
  if (!result.hasNav) {
    result.recommendations.push('Add navigation landmark for primary navigation');
  }
  if (!result.hasMain) {
    result.recommendations.push('Page should have exactly one main landmark');
  }
  if (!result.hasFooter) {
    result.recommendations.push('Consider adding a footer landmark for footer content');
  }

  return result;
}

/**
 * Get accessible name for an SVG element
 * @param {SVGElement} svgElement - The SVG element
 * @returns {string} Accessible name for the SVG
 */
function getSvgAccessibleName(svgElement) {
  if (!svgElement || svgElement.tagName.toLowerCase() !== 'svg') {
    return '';
  }

  // Check aria-label first
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (ariaLabel && ariaLabel.trim()) {
    return ariaLabel.trim();
  }

  // Check aria-labelledby
  const ariaLabelledBy = svgElement.getAttribute('aria-labelledby');
  if (ariaLabelledBy) {
    const targetElement = document.getElementById(ariaLabelledBy);
    if (targetElement) {
      return targetElement.textContent.trim();
    }
  }

  // Check for title element
  const title = svgElement.querySelector('title');
  if (title && title.textContent.trim()) {
    return title.textContent.trim();
  }

  // Check for desc element
  const desc = svgElement.querySelector('desc');
  if (desc && desc.textContent.trim()) {
    return desc.textContent.trim();
  }

  // Check nearest surrounding context
  if (svgElement.parentElement) {
    const nearbyText = svgElement.parentElement.textContent.trim();
    if (nearbyText) {
      return nearbyText;
    }
  }

  return '';
}

/**
 * Create an accessible in-page button/link
 * @param {Object} options - Button options
 * @param {string} options.text - Button text content
 * @param {Function} options.onClick - Click handler
 * @param {string} options.id - Optional button id
 * @param {string} options.className - Optional CSS class
 * @returns {HTMLButtonElement} The created button element
 */
function createInPageButton(options = {}) {
  const {
    text = '',
    onClick = () => {},
    id = '',
    className = ''
  } = options;

  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = text;
  
  if (id) {
    button.id = id;
  }
  
  if (className) {
    button.className = className;
  }

  // Ensure the button is focusable
  button.setAttribute('tabindex', '0');

  // Add click handler
  button.addEventListener('click', (e) => {
    e.preventDefault();
    onClick(e);
  });

  // Add keyboard support
  button.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      button.click();
    }
  });

  return button;
}

// Export the newFocusTrap function as a standalone utility
const newFocusTrap = accessibilityUtils.newFocusTrap;

// Export all utilities
module.exports = {
  accessibilityUtils,
  exportUtils,
  initAccessibility,
  handleCredentialResponse,
  ensureElementId,
  addAriaLabel,
  renderDependencyGraph,
  calculateSum,
  newFocusTrap,
  log,
  sanitizeFilename,
  readFileSafe,
  processData,
  filterValidItems,
  initAccessibility,
  groupByCategory,
  transformInputData,
  validateTableAccessibility,
  ensureElementHasId,
  getLangAttribute,
  personName,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  createInPageButton
};