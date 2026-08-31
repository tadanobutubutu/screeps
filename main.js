// Dependency imports
const { dependencyGraphContent } = require('./dependencyGraphContent');
const { indexContent } = require('./indexContent');
const { spawn } = require('child_process');
const fs = require('fs');

// Accessibility utilities and functions
const accessibilityUtils = {
  // Initialize skip link functionality for keyboard navigation
  initSkipLink: () => {
    const skipLink = document.querySelector('#skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = skipLink.getAttribute('href');
        const target = document.querySelector(targetId);
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
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
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

/**
 * Ensures an element has an ID, generating one if needed.
 * @param {HTMLElement} element - The element to check
 * @param {string} prefix - Prefix for generated ID
 * @returns {string} The element's ID
 */
function ensureElementHasId(element, prefix = 'element') {
  if (!element.id) {
    element.id = `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  }
  return element.id;
}

/**
 * Adds an aria-label attribute to an element.
 * @param {HTMLElement} element - The element to add aria-label to
 * @param {string} label - The label text to set
 * @returns {HTMLElement} The element with the aria-label added
 */
function addAriaLabel(element, label) {
  if (!element) {
    return null;
  }
  
  if (typeof label !== 'string' || label.trim() === '') {
    return element;
  }
  
  element.setAttribute('aria-label', label);
  return element;
}

/**
 * Ensures an element has both an id and an aria-label for accessibility.
 * @param {HTMLElement} element - The element to enhance
 * @param {string} idPrefix - The prefix for generating an id if needed
 * @param {string} ariaLabel - The aria-label text
 * @returns {string|null} The id of the element, or null if element is invalid
 */
function ensureElementAccessibility(element, idPrefix, ariaLabel) {
  if (!element) {
    return null;
  }
  
  const id = ensureElementHasId(element, idPrefix);
  addAriaLabel(element, ariaLabel);
  
  return id;
}

// Sample main.js with dependencyGraph container
function renderDependencyGraph() {
  const container = document.getElementById('dependency-graph');

  if (container) {
    container.setAttribute('role', 'region');
    container.setAttribute('aria-label', 'Dependency graph visualization');
    
    // Ensure the container has an id for accessibility
    ensureElementHasId(container, 'dep-graph');
  }
}

// Accessibility functions to address insight report issues

/**
 * Adds lang attribute to the HTML element
 */
function addLangAttribute() {
  document.documentElement.setAttribute('lang', 'en');
}

/**
 * Fix table structure issues for accessibility
 */
function fixTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    if (!table.querySelector('thead')) {
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const thead = document.createElement('thead');
        thead.appendChild(firstRow);
        table.insertBefore(thead, table.firstChild);
      }
    }
  });
}

/**
 * Adds a main landmark to the document
 */
function addMainLandmark() {
  const mainElement = document.createElement('main');
  mainElement.setAttribute('role', 'main');
  document.body.appendChild(mainElement);
}

/**
 * Fix landmark issues in the document
 */
function fixLandmarkIssues() {
  const landmarks = document.querySelectorAll('[role], main, nav, header, footer');
  landmarks.forEach(landmark => {
    if (!landmark.hasAttribute('aria-label') && !landmark.hasAttribute('aria-labelledby')) {
      landmark.setAttribute('aria-label', landmark.tagName.toLowerCase());
    }
  });
}

/**
 * Ensure unique landmarks
 */
function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('nav, [role="navigation"]');
  landmarks.forEach((landmark, index) => {
    if (!landmark.id) {
      landmark.id = `navigation-${index}`;
    }
  });
}

/**
 * Add accessible names to SVGs using aria-label
 */
function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby')) {
      svg.setAttribute('aria-label', 'SVG graphic');
      svg.setAttribute('role', 'img');
    }
  });
}

/**
 * Add accessible names to SVGs using title element (alternative implementation)
 */
function addAccessibleNamesToSVGs() {
  const svgs = document.querySelectorAll('svg:not([aria-label]):not([aria-labelledby])');
  svgs.forEach(svg => {
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = 'SVG graphic';
    svg.insertBefore(title, svg.firstChild);
    svg.setAttribute('role', 'img');
  });
}

/**
 * Fix fake link issue - elements with role="link" that aren't anchor tags
 */
function fixFakeLinkIssue() {
  const fakeLinks = document.querySelectorAll('[role="link"]:not(a)');
  fakeLinks.forEach(link => {
    if (!link.hasAttribute('tabindex')) {
      link.setAttribute('tabindex', '0');
    }
  });
}

/**
 * Google sign-in logic placeholder
 */
function googleSignIn() {
  // Implementation would integrate with Google OAuth
}

/**
 * Fix button identifiers for accessibility
 */
function fixButtonIdentifiers() {
  const buttons = document.querySelectorAll('button');
  buttons.forEach((button, index) => {
    if (!button.id) {
      button.id = `button-${index}`;
    }
    if (!button.textContent.trim() && !button.hasAttribute('aria-label')) {
      button.setAttribute('aria-label', `Button ${index}`);
    }
  });
}

/**
 * New focus trap implementation
 * @returns {Function} A function that traps focus within a given element
 */
function newFocusTrap() {
  return (element) => {
    if (!element) return;
    const focusable = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    element.addEventListener('keydown', (e) => {
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
  };
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
  return filename.replace(/[^a-z0-9_.-]/gi, '_');
}

function readFileSafe(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    log(`Error reading file ${filePath}: ${error.message}`, 'error');
    return null;
  }
}

// Dependency graph rendering functions
const renderDependencyGraph = (data) => {
  // Render a single dependency graph
  const container = document.getElementById('dependency-graph');
  if (container) {
    renderDependencyGraphs(container, data);
  }
};

const renderDependencyGraphs = (container, dependencies, options) => {
  // Render dependency graphs into the container
  container.innerHTML = '';
  dependencies.forEach(dep => {
    const node = document.createElement('div');
    node.className = 'dependency-node';
    node.textContent = dep.name || 'Unknown';
    node.setAttribute('role', 'treeitem');
    container.appendChild(node);
  });
};

const focusTrap = (element) => {
  // Trap focus within the given element
  const focusableElements = element.querySelectorAll(
    'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
  );
  if (focusableElements.length === 0) return;

  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  element.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    }
  });
};

const spawnProcess = (command, args = [], options = {}) => {
  return spawn(command, args, options);
};

// Application data store
let appData = {
  tables: [],
  config: {}
};

// Logging utility
function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} [${level.toUpperCase()}] ${message}`);
}

function getTables() {
  return appData.tables;
}

function getConfig() {
  return appData.config;
}

function setConfig(newConfig) {
  appData.config = { ...appData.config, ...newConfig };
}

function validateTableAccessibility() {
  // Validate table accessibility
  const tables = document.querySelectorAll('table');
  const issues = [];
  tables.forEach((table, index) => {
    if (!table.querySelector('th')) {
      issues.push(`Table ${index} is missing header cells`);
    }
    if (!table.querySelector('caption') && !table.hasAttribute('aria-label')) {
      issues.push(`Table ${index} is missing caption or aria-label`);
    }
  });
  return issues;
}

// Data processing functions
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

// Initialize accessibility features
const initAccessibility = () => {
  // Initialize skip link
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

  // Run all accessibility fixes
  addLangAttribute();
  fixTableStructure();
  addMainLandmark();
  fixLandmarkIssues();
  ensureUniqueLandmarks();
  addSvgAccessibleNames();
  addAccessibleNamesToSVGs();
  fixFakeLinkIssue();
  fixButtonIdentifiers();
};

const handleCredentialResponse = (response) => {
  // Handle credential response from Google sign-in
  googleSignIn();
};

const ensureElementId = (element) => {
  if (!element.id) {
    element.id = `element-${Math.random().toString(36).substr(2, 9)}`;
  }
  return element.id;
};

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
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraph,
  renderDependencyGraphs,
  spawnProcess,
  focusTrap,
  newFocusTrap,
  getTables,
  getConfig,
  setConfig,
  validateTableAccessibility,
  sanitizeFilename,
  readFileSafe,
  log,
  appData,
  dependencyGraphContent,
  indexContent,
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  fixLandmarkIssues,
  ensureUniqueLandmarks,
  addSvgAccessibleNames,
  addAccessibleNamesToSVGs,
  fixFakeLinkIssue,
  googleSignIn,
  fixButtonIdentifiers,
  processData,
  filterValidItems,
  groupByCategory
};