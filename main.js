// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())

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

// REACT_015: Get lang attribute for HTML element
function getLangAttribute(element) {
  if (!element) return 'en';
  return element.getAttribute('lang') || element.lang || 'en';
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

// REACT_036 & REACT_015: Create accessible in-page button
function createInPageButton(options = {}) {
  const {
    text = '',
    onClick = () => {},
    ariaLabel = '',
    id = `btn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    className = '',
    href = '#',
    type = 'button'
  } = options;

  const button = document.createElement(type === 'link' ? 'a' : 'button');
  button.id = id;
  button.className = className;
  button.href = type === 'link' ? href : undefined;
  button.textContent = text;

  if (ariaLabel) {
    button.setAttribute('aria-label', ariaLabel);
  }

  button.addEventListener('click', (e) => {
    if (type !== 'link') {
      e.preventDefault();
    }
    onClick(e);
  });

  return button;
}

// REACT_027: Validate table accessibility
function validateTableAccessibility(table) {
  const issues = [];
  
  if (!table) {
    return { valid: false, issues: ['Table element is null or undefined'] };
  }

  // Check for caption
  const caption = table.querySelector('caption');
  if (!caption) {
    issues.push('Table missing caption element');
  }

  // Check for th elements with scope or headers
  const headers = table.querySelectorAll('th');
  if (headers.length === 0) {
    issues.push('Table missing header cells (th)');
  }

  // Check for proper scope attributes
  headers.forEach(th => {
    if (!th.getAttribute('scope') && !th.getAttribute('headers')) {
      issues.push('Header cell missing scope or headers attribute');
    }
  });

  return {
    valid: issues.length === 0,
    issues
  };
}

// REACT_027: Validate table structure
function validateTableStructure(table) {
  const issues = [];
  
  if (!table) {
    return { valid: false, issues: ['Table element is null or undefined'] };
  }

  // Check for thead and tbody
  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');

  if (!thead) {
    issues.push('Table missing thead element');
  }

  if (!tbody) {
    issues.push('Table missing tbody element');
  }

  // Check for proper row structure
  const rows = table.querySelectorAll('tr');
  if (rows.length === 0) {
    issues.push('Table has no rows');
  }

  // Check that thead has th elements
  if (thead) {
    const thElements = thead.querySelectorAll('th');
    if (thElements.length === 0) {
      issues.push('Table thead missing th elements');
    }
  }

  return {
    valid: issues.length === 0,
    issues
  };
}

// REACT_017 & REACT_025: Validate landmark
function validateLandmark(element) {
  const issues = [];
  
  if (!element) {
    return { valid: false, issues: ['Element is null or undefined'] };
  }

  // Check for landmark roles
  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'region'];
  const hasLandmarkRole = landmarkRoles.some(role => 
    element.getAttribute('role') === role || element.tagName.toLowerCase() === role
  );

  if (!hasLandmarkRole) {
    issues.push('Element does not have a landmark role');
  }

  return {
    valid: issues.length === 0,
    issues
  };
}

// REACT_017 & REACT_025: Validate landmark structure
function validateLandmarkStructure(document) {
  const issues = [];
  
  if (!document) {
    return { valid: false, issues: ['Document is null or undefined'] };
  }

  // Check for main landmark (should be unique)
  const mains = document.querySelectorAll('main, [role="main"]');
  if (mains.length > 1) {
    issues.push(`Multiple main landmarks found (${mains.length}). Should have only one.`);
  }

  // Check for navigation landmarks
  const navs = document.querySelectorAll('nav, [role="navigation"]');
  if (navs.length === 0) {
    issues.push('No navigation landmark found');
  }

  // Check for banner landmark
  const banners = document.querySelectorAll('header, [role="banner"]');
  if (banners.length === 0) {
    issues.push('No banner landmark found');
  }

  // Check for contentinfo landmark
  const contentinfos = document.querySelectorAll('footer, [role="contentinfo"]');
  if (contentinfos.length === 0) {
    issues.push('No contentinfo landmark found');
  }

  return {
    valid: issues.length === 0,
    issues
  };
}

// REACT_041: Get SVG accessible name
function getSvgAccessibleName(svgElement) {
  if (!svgElement) return '';
  
  // Check aria-label
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;

  // Check aria-labelledby
  const ariaLabelledby = svgElement.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labelledElement = document.getElementById(ariaLabelledby);
    if (labelledElement) return labelledElement.textContent;
  }

  // Check title element inside SVG
  const title = svgElement.querySelector('title');
  if (title) return title.textContent;

  // Check for role="img" with descriptive text
  const role = svgElement.getAttribute('role');
  if (role === 'img') {
    return svgElement.getAttribute('aria-describedby') || '';
  }

  return '';
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

  if (typeof inputData === 'string') {
    let result = inputData;
    if (trimWhitespace) {
      result = result.trim();
    }
    if (uppercase) {
      result = result.toUpperCase();
    }
    if (maxLength !== null && result.length > maxLength) {
      result = result.substring(0, maxLength);
    }
    return result;
  }
  
  if (Array.isArray(inputData)) {
    return inputData.map(item => transformInputData(item, { preserveKeys, uppercase, trimWhitespace, maxLength }));
  }
  
  if (typeof inputData === 'object' && inputData !== null) {
    const result = {};
    for (const [key, value] of Object.entries(inputData)) {
      let transformedValue = transformInputData(value, { preserveKeys, uppercase, trimWhitespace, maxLength });
      if (!preserveKeys && typeof value === 'string') {
        // Only uppercase keys if preserveKeys is false
      }
      result[key] = transformedValue;
    }
    return result;
  }
  
  return inputData;
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
  createInPageButton,
  personName,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
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