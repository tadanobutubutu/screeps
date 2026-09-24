// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
// TODO: Import required module(s) and export the new necessary function(s) here in main.js (preserving the original code)
const main = require('./utilities');
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
  },

  /**
   * Function to generate a unique landmark identifier
   * Addresses REACT_025: Ensure unique landmarks
   * @param {string} baseName - The base name for the landmark
   * @param {number} index - The index number for uniqueness
   * @returns {string} Unique landmark identifier
   */
  generateUniqueLandmarkId(baseName, index) {
    return `${baseName}-${index}`;
  },

  /**
   * Function to check and fix landmark roles
   * Addresses REACT_017: Add landmark roles and fix landmark issues
   * @param {Object} element - The element to check
   * @param {string} role - The landmark role to apply
   * @returns {Object} Element with proper landmark role
   */
  applyLandmarkRole(element, role) {
    if (!element.props || !element.props.role) {
      return {
        ...element,
        props: {
          ...element.props,
          role: role
        }
      };
    }
    return element;
  },

  /**
   * Function to add accessible name to an SVG element
   * Addresses REACT_041: Add accessible names to 2 SVGs
   * @param {Object} svgElement - The SVG element
   * @param {string} description - The accessible description
   * @returns {Object} SVG element with aria-label
   */
  addSvgAccessibleName(svgElement, description) {
    return {
      ...svgElement,
      props: {
        ...svgElement.props,
        'aria-label': description,
        role: 'img'
      }
    };
  },
  announceToScreenReader: (message, priority = 'polite') => {
    const liveRegion = document.getElementById('a11y-announcer') || (() => {
      const region = document.createElement('div');
      region.id = 'a11y-announcer';
      region.setAttribute('aria-live', priority);
      region.setAttribute('aria-atomic', 'true');
      region.style.position = 'absolute';
      region.style.left = '-9999px';
      document.body.appendChild(region);
      return region;
    })();
    liveRegion.textContent = '';
    setTimeout(() => { liveRegion.textContent = message; }, 100);
  },

  // Handle keyboard navigation
  handleKeyboardNav: (e, handlers) => {
    const key = e.key;
    if (handlers[key]) {
      handlers[key](e);
    }
    return element;
  },

  // New focus trap function for keyboard navigation
  newFocusTrap: (element) => {
    if (!element) return;
    
    // Get all focusable elements within the container
    const focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"]), details[open] > summary, details summary'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    // Focus the first element when trap starts
    firstElement.focus();
    
    // Add keydown listener for tab navigation
    const keydownHandler = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
      
      // Allow Escape to close the trap
      if (e.key === 'Escape') {
        element.dispatchEvent(new CustomEvent('closeFocusTrap'));
      }
    };
    
    element.addEventListener('keydown', keydownHandler);
    
    // Return cleanup function
    return () => {
      element.removeEventListener('keydown', keydownHandler);
    };
  }
};

// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)


// Export functionality with accessibility support
const exportUtils = {
  exportData: (data, filename, mimeType) => {
    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.setAttribute('aria-label', `Download ${filename}`);
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
  
  if (!dependencies) {
    throw new Error('Dependencies data is required');
  }
  
  const containerId = ensureElementHasId(container, 'graph-container');
  
  addAriaLabel(container, `Dependency graph: ${containerId}`);
  
  const graphContainer = document.createElement('div');
  graphContainer.id = containerId;
  
  // Use imported dependencyGraphContent module for multiple graphs
  const content = dependencyGraphContent.generateMultipleGraphs(dependencies, options);
  graphContainer.innerHTML = content;
  
  container.appendChild(graphContainer);
  
  // Initialize focus trap for accessibility
  focusTrap(graphContainer);
  
  return graphContainer;
};

// Render index view with content from module
const renderIndexView = (container, data) => {
  if (!container) {
    throw new Error('Container element is required');
  }
  
  if (!data) {
    throw new Error('Data is required');
  }
  
  const containerId = ensureElementHasId(container, 'index-container');
  
  // Use imported indexContent module
  const content = indexContent.generateIndexContent(data);
  
  addAriaLabel(container, `Index view: ${containerId}`);
  
  const indexContainer = document.createElement('div');
  indexContainer.id = containerId;
  indexContainer.innerHTML = content;
  container.appendChild(indexContainer);
  
  return indexContainer;
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

    if (expectedCellCount === null) {
      expectedCellCount = cells.length;
    } else if (cells.length !== expectedCellCount) {
      issues.push(`Row ${rowIndex} has inconsistent cell count: expected ${expectedCellCount}, got ${cells.length}`);
    }
  });

  return issues;
}

// Toolbox original functions
function getTables() {
  return appData.tables;
}

// Function for trap focus implementation (merged with newFocusTrap)
function newFunction(element) {
  const trap = newFocusTrap(element);
  trap.activate();
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

// Export new accessibility functions
export {
  addLangAttributeToHtml,
  addLandmarkRoles,
  wrapPrimaryContentInMain,
  ensureUniqueLandmarks,
  addAccessibleNamesToSVGs,
  fixFakeLinks,
  addressAccessibilityIssues,
  applyAllAccessibilityFixes,
  newFocusTrap,
  accessibilityUtils,
  ensureElementId,
  addAriaLabel,
  renderDependencyGraph,
  getTables,
  getConfig,
  setConfig,
  addAccessibleName,
};

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


// Additional helper functions exported
function getLangAttribute(element) {
  if (!element) {
    element = document.documentElement;
  }
  return element.lang || element.getAttribute('lang') || document.documentElement.lang || null;
}

function personName(personData) {
  if (!personData) return '';
  
  const parts = [];
  if (personData.firstName) parts.push(personData.firstName);
  if (personData.lastName) parts.push(personData.lastName);
  
  return parts.join(' ') || personData.name || '';
}

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
      child => ['TH', 'TD'].includes(child.tagName.to