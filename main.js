const { createWebResourceButton, validateAccessibilityReport } = require('./utilities');

const http = require('http');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  port: process.env.PORT || 3000,
  host: process.env.HOST || 'localhost',
  maxRetries: 3,
  timeout: 5000
};

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

function getLangAttribute(element, lang) {
  if (element) {
    element.setAttribute('lang', lang || 'en');
  }
  return element;
}

function personName(name) {
  const span = document.createElement('span');
  span.setAttribute('aria-label', `Person name: ${name}`);
  span.textContent = name;
  return span;
}

function validateTableAccessibility(table) {
  if (!table) return false;
  
  const hasCaption = table.querySelector('caption') !== null;
  const hasHeaders = table.querySelector('thead') !== null;
  const rows = table.querySelectorAll('tr');
  
  let isValid = hasCaption && hasHeaders;
  
  if (rows.length > 0) {
    const firstRowCells = rows[0].querySelectorAll('th, td');
    const hasScope = Array.from(firstRowCells).some(cell => 
      cell.hasAttribute('scope')
    );
    isValid = isValid && hasScope;
  }
  
  return isValid;
}

function validateTableStructure(table) {
  if (!table) return false;
  
  const rows = table.querySelectorAll('tr');
  let isValid = true;
  
  rows.forEach((row, index) => {
    const cells = row.querySelectorAll('td, th');
    if (index === 0) {
      // Header row should have th elements
      const hasHeaderCells = Array.from(cells).some(cell => 
        cell.tagName.toLowerCase() === 'th'
      );
      isValid = isValid && hasHeaderCells;
    } else {
      // Data rows should have consistent number of cells
      if (cells.length !== rows[0].querySelectorAll('td, th').length) {
        isValid = false;
      }
    }
  });
  
  return isValid;
}

function validateLandmark(element) {
  if (!element) return false;
  
  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'form', 'search'];
  const role = element.getAttribute('role');
  const tagName = element.tagName.toLowerCase();
  
  // Check for semantic HTML5 elements
  const landmarks = ['header', 'nav', 'main', 'aside', 'footer', 'form', 'section'];
  if (landmarks.includes(tagName)) {
    return true;
  }
  
  // Check for explicit ARIA landmark roles
  if (role && landmarkRoles.includes(role)) {
    return true;
  }
  
  return false;
}

function validateLandmarkStructure(element) {
  if (!element) return false;
  
  const landmarks = element.querySelectorAll(
    'header, nav, main, aside, footer, form[role="search"], section[aria-label], div[role="banner"], div[role="navigation"], div[role="main"], div[role="complementary"], div[role="contentinfo"]'
  );
  
  return landmarks.length > 0;
}

function getSvgAccessibleName(svg, name) {
  if (svg && name) {
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', name);
  }
  return svg;
}

function createInPageButton(text, onClick) {
  const button = document.createElement('button');
  button.textContent = text;
  button.setAttribute('aria-label', text);
  button.addEventListener('click', onClick);
  return button;
}

function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll(
    'header, nav, main, aside, footer, [role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"]'
  );
  
  const landmarkTypes = {};
  
  landmarks.forEach((landmark, index) => {
    const tagName = landmark.tagName.toLowerCase();
    const role = landmark.getAttribute('role');
    const identifier = role || tagName;
    
    if (!landmarkTypes[identifier]) {
      landmarkTypes[identifier] = 0;
    } else {
      landmarkTypes[identifier]++;
      if (!landmark.hasAttribute('aria-label') && !landmark.hasAttribute('aria-labelledby')) {
        landmark.setAttribute('aria-label', `${identifier} ${landmarkTypes[identifier] + 1}`);
      }
    }
  });
}

function newFocusTrap(element) {
  if (!element) return;
  
  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
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
  
  // Focus first element when trap starts
  firstElement.focus();
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
  
  if (typeof inputData === 'string') {
    let result = inputData;
    
    if (trimWhitespace) {
      result = result.trim();
    }
    
    if (uppercase) {
      result = result.toUpperCase();
    }
    
    if (maxLength && result.length > maxLength) {
      result = result.substring(0, maxLength);
    }
    
    return result;
  }
  
  if (typeof inputData === 'object' && !Array.isArray(inputData)) {
    const result = {};
    
    for (const key in inputData) {
      if (inputData.hasOwnProperty(key)) {
        if (preserveKeys || !key.startsWith('_')) {
          result[key] = transformInputData(inputData[key], options);
        }
      }
    }
    
    return result;
  }
  
  if (Array.isArray(inputData)) {
    return inputData.map(item => transformInputData(item, options));
  }
  
  return inputData;
}

function calculateSum(a, b) { return a + b; }

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

function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} [${level.toUpperCase()}] ${message}`);
}

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

const initAccessibility = () => {
  accessibilityUtils.initSkipLink();
  
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

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccessibility);
  } else {
    initAccessibility();
  }
}

function addressAccessibilityIssues() {
  const html = document.documentElement;
  if (html && !html.getAttribute('lang')) {
    html.setAttribute('lang', 'en');
  }

  document.querySelectorAll('table').forEach(table => {
    if (!validateTableAccessibility(table)) {
      console.warn('Table accessibility issue found', table);
    }
    if (!validateTableStructure(table)) {
      console.warn('Table structure issue found', table);
    }
  });

  document.querySelectorAll('[role], header, nav, main, aside, footer').forEach(element => {
    if (!validateLandmark(element)) {
      console.warn('Landmark issue found', element);
    }
  });

  ensureUniqueLandmarks();

  document.querySelectorAll('svg').forEach(svg => {
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
      svg.setAttribute('aria-label', 'SVG graphic');
    }
  });

  document.querySelectorAll('.fake-link').forEach(link => {
    createInPageButton(link.textContent, () => link.click());
  });

  document.querySelectorAll('[data-modal]').forEach(modal => {
    newFocusTrap(modal);
  });
}

// Module-level function definitions
function affectedFunction() {
  // Function implementation
  return 'affected function result';
}

function updateFunction() {
  // Function implementation
  return 'update function result';
}

function accessibleFunction() {
  // Function implementation
  return 'accessible function result';
}

// Main entry point
function main() {
  // Application initialization
  return 'main function executed';
}

// Export functions to make them accessible
module.exports = {
  affectedFunction,
  updateFunction,
  accessibleFunction,
  main,
  accessibilityUtils,
  exportUtils,
  initAccessibility,
  handleCredentialResponse,
  ensureElementId,
  addAriaLabel,
  renderDependencyGraph,
  calculateSum,
  getLangAttribute,
  personName,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  createInPageButton,
  ensureUniqueLandmarks,
  newFocusTrap,
  transformInputData,
  addressAccessibilityIssues
};

// Also attach to global scope for browser/standalone access
if (typeof window !== 'undefined') {
  window.affectedFunction = affectedFunction;
  window.updateFunction = updateFunction;
  window.accessibleFunction = accessibleFunction;
  window.main = main;
}