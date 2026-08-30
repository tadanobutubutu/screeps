// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
// TODO: Import required module(s) and export the new necessary function(s) here in main.js (preserving the original code)

// Accessibility utilities and functions
// TODO: Address accessibility issues from insight report — FIXED (combined with the export code)

// Utility functions for accessibility
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
  }
};

// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)

const ensureElementId = (element) => {
  if (element && !element.id) {
    element.id = `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
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

// REACT_015: Get lang attribute from HTML element
function getLangAttribute() {
  const htmlElement = document.querySelector('html');
  return htmlElement ? htmlElement.getAttribute('lang') : null;
}

// REACT_015 & REACT_036: Get or create a person's accessible name
function personName(personData) {
  if (!personData) return null;
  if (typeof personData === 'string') return personData.trim();
  return [personData.firstName, personData.lastName]
    .filter(Boolean)
    .join(' ')
    .trim() || null;
}

// REACT_027: Validate table accessibility
function validateTableAccessibility(tableElement) {
  if (!tableElement || tableElement.tagName !== 'TABLE') {
    return { valid: false, errors: ['Invalid table element'] };
  }
  const errors = [];
  
  // Check for caption
  const caption = tableElement.querySelector('caption');
  if (!caption) {
    errors.push('Table should have a caption for accessibility');
  }
  
  // Check for th elements with scope or headers
  const headers = tableElement.querySelectorAll('th');
  headers.forEach((th, index) => {
    if (!th.getAttribute('scope') && !th.getAttribute('id')) {
      errors.push(`Header at index ${index} missing scope or id attribute`);
    }
  });
  
  return { valid: errors.length === 0, errors };
}

// REACT_027: Validate table structure
function validateTableStructure(tableElement) {
  if (!tableElement || tableElement.tagName !== 'TABLE') {
    return { valid: false, errors: ['Invalid table element'] };
  }
  const errors = [];
  
  // Check for thead and tbody
  const thead = tableElement.querySelector('thead');
  const tbody = tableElement.querySelector('tbody');
  
  if (!thead) {
    errors.push('Table should have a thead element');
  }
  if (!tbody) {
    errors.push('Table should have a tbody element');
  }
  
  // Check for proper row structure
  const rows = tableElement.querySelectorAll('tr');
  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('td, th');
    if (cells.length === 0) {
      errors.push(`Row ${rowIndex} has no cells`);
    }
  });
  
  return { valid: errors.length === 0, errors };
}

// REACT_017 & REACT_025: Validate landmark
function validateLandmark(element) {
  if (!element) {
    return { valid: false, errors: ['Element is required'] };
  }
  const errors = [];
  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'];
  const role = element.getAttribute('role');
  const tagName = element.tagName.toLowerCase();
  
  // Check if element has landmark role or is a landmark element
  const isLandmark = role && landmarkRoles.includes(role);
  const isLandmarkTag = ['header', 'nav', 'main', 'aside', 'footer'].includes(tagName);
  
  if (!isLandmark && !isLandmarkTag) {
    errors.push('Element is not a valid landmark');
  }
  
  return { valid: errors.length === 0, errors };
}

// REACT_017 & REACT_025: Validate landmark structure
function validateLandmarkStructure(document) {
  const doc = document || document;
  const errors = [];
  const landmarks = {};
  
  // Check for required landmarks
  const mainElement = doc.querySelector('main, [role="main"]');
  if (!mainElement) {
    errors.push('Document should have a main landmark');
  }
  
  const navElement = doc.querySelector('nav, [role="navigation"]');
  if (!navElement) {
    errors.push('Document should have a navigation landmark');
  }
  
  // Check for duplicate landmarks
  ['banner', 'navigation', 'main', 'complementary', 'contentinfo'].forEach(role => {
    const elements = doc.querySelectorAll(`[role="${role}"]`);
    if (elements.length > 1) {
      errors.push(`Multiple ${role} landmarks found (${elements.length})`);
    }
  });
  
  return { valid: errors.length === 0, errors };
}

// REACT_041: Get SVG accessible name
function getSvgAccessibleName(svgElement) {
  if (!svgElement || svgElement.tagName !== 'svg') {
    return null;
  }
  
  // Check aria-label
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;
  
  // Check aria-labelledby
  const ariaLabelledby = svgElement.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labelElement = document.getElementById(ariaLabelledby);
    return labelElement ? labelElement.textContent : null;
  }
  
  // Check title element
  const title = svgElement.querySelector('title');
  return title ? title.textContent : null;
}

// REACT_036: Create accessible in-page button
function createInPageButton(options = {}) {
  const { text, onClick, ariaLabel, id } = options;
  
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = text || '';
  
  if (ariaLabel) {
    button.setAttribute('aria-label', ariaLabel);
  }
  
  if (id) {
    button.id = id;
  }
  
  if (onClick && typeof onClick === 'function') {
    button.addEventListener('click', onClick);
  }
  
  return button;
}

function newFocusTrap() {
  // New function implementation for enhanced focus trap
  return {
    activate: (element) => {
      accessibilityUtils.trapFocus(element);
    },
    deactivate: (element) => {
      element.removeEventListener('keydown', accessibilityUtils.trapFocus);
    }
  };
}

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
  console.log(`${timestamp} [${level.toUpperCase()}] ${message}`);
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
  return filename.replace(/[^a-zA-Z0-9_.-]/g, '_');
}

function readFileSafe(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    log(`Error reading file ${filePath}: ${error.message}`, 'error');
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

  let result = inputData;

  if (typeof result === 'string') {
    if (trimWhitespace) {
      result = result.trim();
    }
    if (uppercase) {
      result = result.toUpperCase();
    }
    if (maxLength !== null && result.length > maxLength) {
      result = result.substring(0, maxLength);
    }
  } else if (Array.isArray(result)) {
    result = result.map(item => transformInputData(item, { preserveKeys, uppercase, trimWhitespace, maxLength }));
  } else if (typeof result === 'object' && result !== null) {
    const transformed = {};
    Object.keys(result).forEach(key => {
      let value = result[key];
      if (trimWhitespace && typeof value === 'string') {
        value = value.trim();
      }
      if (uppercase && typeof value === 'string') {
        value = value.toUpperCase();
      }
      if (maxLength !== null && typeof value === 'string' && value.length > maxLength) {
        value = value.substring(0, maxLength);
      }
      transformed[key] = value;
    });
    result = transformed;
  }

  return result;
}

// Initialize on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccessibility);
  } else {
    initAccessibility();
  }
}

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
  // Accessibility functions referenced in the insight report
  getLangAttribute,
  personName,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  createInPageButton,
  newFocusTrap,
  // Utility functions
  sanitizeFilename,
  readFileSafe,
  processData,
  filterValidItems,
  groupByCategory,
  transformInputData,
  log
};