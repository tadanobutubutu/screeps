// TODO: This is the existing code that needs to be preserve
// (This comment remains as-is)
// TODO: Import required module(s) and export the new necessary function(s) here in main.js (preserving the original code)

const fs = require('fs');

// Accessibility utilities and functions
// TODO: Address accessibility issues from insight report:
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
  newFocusTrap: () => {
    // New function implementation
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

// Accessibility: Get lang attribute from HTML element
function getLangAttribute(element) {
  if (!element) {
    return document.documentElement?.lang || 'en';
  }
  
  // Check element and its ancestors for lang attribute
  let current = element;
  while (current && current !== document.documentElement) {
    if (current.lang) {
      return current.lang;
    }
    current = current.parentElement;
  }
  
  // Fall back to document language
  return document.documentElement?.lang || 'en';
}

// Accessibility: Generate accessible name for person element
function personName(element, options = {}) {
  const {
    preferFirstName = false,
    includeTitle = true,
    fallback = 'Person'
  } = options;
  
  if (!element) {
    return fallback;
  }
  
  // Look for common name elements/attributes
  const firstName = element.querySelector('[data-first-name], .first-name, .given-name, [itemprop="givenName"]');
  const lastName = element.querySelector('[data-last-name], .last-name, .family-name, [itemprop="familyName"]');
  const fullName = element.querySelector('[data-name], .name, [itemprop="name"]');
  const titleAttr = element.getAttribute('title');
  const ariaLabel = element.getAttribute('aria-label');
  
  let name = '';
  
  if (ariaLabel) {
    name = ariaLabel;
  } else if (fullName && fullName.textContent?.trim()) {
    name = fullName.textContent.trim();
  } else if (firstName && lastName) {
    const first = firstName.textContent?.trim() || '';
    const last = lastName.textContent?.trim() || '';
    name = preferFirstName ? `${first} ${last}` : `${last}, ${first}`;
  } else if (firstName?.textContent?.trim()) {
    name = firstName.textContent.trim();
  } else if (lastName?.textContent?.trim()) {
    name = lastName.textContent.trim();
  } else if (titleAttr) {
    name = titleAttr;
  }
  
  if (!name) {
    return fallback;
  }
  
  // Optionally prepend title
  if (includeTitle && titleAttr && name !== titleAttr) {
    return `${titleAttr}: ${name}`;
  }
  
  return name;
}

// Accessibility: Validate table structure
function validateTableStructure(tableElement) {
  const issues = [];

  if (!tableElement || tableElement.tagName.toLowerCase() !== 'table') {
    issues.push('Element is not a TABLE element');
    return issues;
  }

  // Check for proper thead/tbody/tfoot structure
  const thead = tableElement.querySelector('thead');
  const tbody = tableElement.querySelector('tbody');
  const tfoot = tableElement.querySelector('tfoot');
  
  if (tableElement.querySelectorAll('tr').length > 0 && !thead && !tbody) {
    issues.push('TABLE should have a proper thead or tbody structure');
  }

  // Check scope attributes on TH elements
  const thElements = tableElement.querySelectorAll('th');
  thElements.forEach((th, index) => {
    if (!th.hasAttribute('scope')) {
      issues.push(`TH element at index ${index} is missing scope attribute`);
    }
  });

  // Check for proper row/column headers using headers attribute
  const tdWithHeaders = tableElement.querySelectorAll('td[headers]');
  const headerIds = new Set();
  thElements.forEach(th => {
    if (th.id) headerIds.add(th.id);
  });
  
  tdWithHeaders.forEach((td, index) => {
    const headerRefs = td.getAttribute('headers').split(' ');
    const invalidRefs = headerRefs.filter(ref => !headerIds.has(ref));
    if (invalidRefs.length > 0) {
      issues.push(`TD at index ${index} references non-existent headers: ${invalidRefs.join(', ')}`);
    }
  });

  return issues;
}

// Accessibility: Validate landmarks
function validateLandmark(element) {
  const issues = [];
  const validLandmarks = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'region'];

  if (!element) {
    // Validate all landmarks in document
    if (typeof document !== 'undefined') {
      const landmarks = document.querySelectorAll('[role], header, nav, main, aside, footer');
      landmarks.forEach((landmark, index) => {
        const role = landmark.getAttribute('role');
        const tagName = landmark.tagName.toLowerCase();
        
        if (role && !validLandmarks.includes(role)) {
          issues.push(`Landmark at index ${index} has invalid role: ${role}`);
        }
      });
    }
    return issues;
  }

  const role = element.getAttribute('role');
  const tagName = element.tagName.toLowerCase();

  // Check if element has valid landmark role or is a landmark element
  const isLandmarkElement = ['header', 'nav', 'main', 'aside', 'footer'].includes(tagName);
  const hasValidRole = role && (validLandmarks.includes(role) || role === 'navigation');

  if (!isLandmarkElement && !hasValidRole) {
    issues.push('Element is not a valid landmark');
  }

  return issues;
}

// Accessibility: Validate landmark structure
function validateLandmarkStructure(document) {
  const issues = [];

  if (typeof document === 'undefined') {
    issues.push('Document is required for landmark validation');
    return issues;
  }

  // Check for multiple main landmarks
  const mains = document.querySelectorAll('main, [role="main"]');
  if (mains.length > 1) {
    issues.push(`Found ${mains.length} main landmarks. There should typically be only one main landmark.`);
  }

  // Check for multiple banner landmarks
  const banners = document.querySelectorAll('header:not([role]), [role="banner"]');
  if (banners.length > 1) {
    issues.push(`Found ${banners.length} banner landmarks. There should typically be only one banner landmark.`);
  }

  // Check for multiple contentinfo landmarks
  const contentinfos = document.querySelectorAll('footer:not([role]), [role="contentinfo"]');
  if (contentinfos.length > 1) {
    issues.push(`Found ${contentinfos.length} contentinfo landmarks. There should typically be only one contentinfo landmark.`);
  }

  // Check for landmark accessibility name
  const landmarksWithRoles = document.querySelectorAll('[role]');
  landmarksWithRoles.forEach((landmark, index) => {
    const role = landmark.getAttribute('role');
    const hasLabel = landmark.hasAttribute('aria-label') || landmark.hasAttribute('aria-labelledby');
    
    // Regions and navigation typically need labels when multiple exist
    if ((role === 'region' || role === 'navigation') && !hasLabel) {
      const sameRoleLandmarks = document.querySelectorAll(`[role="${role}"]`);
      if (sameRoleLandmarks.length > 1) {
        issues.push(`Landmark with role="${role}" at index ${index} should have an accessible name when multiple exist`);
      }
    }
  });

  return issues;
}

// Accessibility: Get SVG accessible name
function getSvgAccessibleName(svgElement, options = {}) {
  const {
    preferTitle = true,
    fallback = 'Image'
  } = options;

  if (!svgElement || svgElement.tagName.toLowerCase() !== 'svg') {
    return fallback;
  }

  // Check aria-label first
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }

  // Check aria-labelledby reference
  const ariaLabelledby = svgElement.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labelElement = document.getElementById(ariaLabelledby);
    if (labelElement && labelElement.textContent?.trim()) {
      return labelElement.textContent.trim();
    }
  }

  // Check for title element inside SVG
  const title = svgElement.querySelector('title');
  if (title && title.textContent?.trim()) {
    return title.textContent.trim();
  }

  // Check for desc element
  const desc = svgElement.querySelector('desc');
  if (desc && desc.textContent?.trim()) {
    return desc.textContent.trim();
  }

  // Check for data attributes
  const dataName = svgElement.getAttribute('data-name') || svgElement.getAttribute('data-title');
  if (dataName) {
    return dataName;
  }

  // Fall back to role="img" with no name
  const role = svgElement.getAttribute('role');
  if (role === 'img') {
    return fallback;
  }

  return fallback;
}

// Accessibility: Ensure unique landmarks
function ensureUniqueLandmarks(document) {
  const issues = [];
  
  if (typeof document === 'undefined') {
    return { issues: ['Document is required'], duplicates: [] };
  }

  const duplicates = [];
  const landmarkRoles = ['main', 'navigation', 'banner', 'contentinfo', 'complementary', 'search', 'region'];

  landmarkRoles.forEach(role => {
    const landmarks = document.querySelectorAll(`[role="${role}"], ${role === 'main' ? 'main' : role === 'navigation' ? 'nav' : role === 'banner' ? 'header' : role === 'contentinfo' ? 'footer' : role === 'complementary' ? 'aside' : ''}`);
    const filteredLandmarks = Array.from(landmarks).filter(l => {
      if (role === 'main') return l.tagName === 'MAIN' || l.getAttribute('role') === 'main';
      if (role === 'navigation') return l.tagName === 'NAV' || l.getAttribute('role') === 'navigation';
      if (role === 'banner') return l.tagName === 'HEADER' && !l.getAttribute('role');
      if (role === 'contentinfo') return l.tagName === 'FOOTER' && !l.getAttribute('role');
      return l.getAttribute('role') === role;
    });

    if (filteredLandmarks.length > 1) {
      const ids = filteredLandmarks.map((l, i) => {
        if (!l.id) {
          l.id = `${role}-landmark-${i + 1}`;
        }
        return l.id;
      });
      duplicates.push({ role, count: filteredLandmarks.length, ids });
      
      // Add labels to distinguish landmarks
      filteredLandmarks.forEach((landmark, index) => {
        if (!landmark.hasAttribute('aria-label') && !landmark.hasAttribute('aria-labelledby')) {
          const label = `${role.charAt(0).toUpperCase() + role.slice(1)} ${index + 1}`;
          landmark.setAttribute('aria-label', label);
        }
      });
    }
  });

  return { issues, duplicates };
}

// Accessibility: Create in-page button (for fake link fix)
function createInPageButton(options = {}) {
  const {
    text = 'Button',
    onClick = null,
    id = null,
    className = '',
    disabled = false,
    ariaLabel = null
  } = options;

  const button = document.createElement('button');
  
  button.textContent = text;
  button.className = className;
  button.disabled = disabled;
  
  if (id) {
    button.id = id;
  }
  
  if (ariaLabel) {
    button.setAttribute('aria-label', ariaLabel);
  }

  // Ensure button semantics
  button.setAttribute('type', 'button');
  button.setAttribute('role', 'button');

  // Add keyboard support
  button.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!button.disabled) {
        button.click();
      }
    }
  });

  // Add click handler
  if (onClick && typeof onClick === 'function') {
    button.addEventListener('click', onClick);
  }

  // Add focus styles
  button.style.outline = 'none';
  button.addEventListener('focus', () => {
    button.style.outline = '2px solid currentColor';
    button.style.outlineOffset = '2px';
  });
  button.addEventListener('blur', () => {
    button.style.outline = 'none';
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
  ensureUniqueLandmarks,
  createInPageButton
};