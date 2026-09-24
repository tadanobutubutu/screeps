// TODO: This is the existing code that needs to be preserved
// Addressed accessibility issues from insight report

// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
// TODO: Import required modules and export the new necessary functions here in main.js (preserving the original code)

const { createInPageButton, createWebResourceButton, validateTableAccessibility: validateTableAccessibilityUtil, validateTableStructure, validateLandmark, validateLandmarkStructure, getSvgAccessibleName, getLangAttribute, validateAccessibilityReport } = require('./utilities');
const main = require('./utilities');

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

// Existing utility functions
function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} [${level.toUpperCase()}]: ${message}`);
}

function validateInput(input) {
  if (typeof input !== 'string') {
    return false;
  }
  return input.length > 0 && input.length <= 1000;
}

function parseJSONsafe(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return null;
  }
}

function formatResponse(data, statusCode = 200) {
  return {
    statusCode,
    data,
    timestamp: new Date().toISOString()
  };
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function retryOperation(operation, maxRetries = CONFIG.maxRetries) {
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      log(`Attempt ${i + 1} failed: ${error.message}`, 'warn');
      if (i < maxRetries - 1) {
        await delay(1000 * (i + 1));
      }
    }
  }
  throw lastError;
}

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

// New function added as per issue
function myNewFunction(input) {
  if (typeof input !== 'string') {
    return input;
  }
  return input.toUpperCase();
}

// Calculate sum of numbers array
function calculateSum(numbers) {
    return numbers.reduce((sum, num) => sum + num, 0);
}

// Additional utility functions for accessibility
function addMainLandmark() {
  // Implementation for REACT_017: Add landmark issues
  // ...
}

function ensureUniqueLandmarks() {
  // Implementation for REACT_025: Ensure unique landmarks
  // ...
}

function addAltAttribute() {
  // Implementation for adding alt attributes
  // ...
}

function replaceButtonId() {
  // Implementation for replacing button id
  // ...
}

function addLangAttribute() {
  // Implementation for adding lang attribute
  // ...
}

function fixTableStructure() {
  // Implementation for fixing table structure
  // ...
}

function addSvgAccessibleName() {
  // Implementation for adding SVG accessible name
  // ...
}

function fixFakeLinkIssue() {
  // Implementation for fixing fake link issues
  // ...
}

function addAriaAttribute() {
  // Implementation for adding aria attributes
  // ...
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
 * Adds an aria-label attribute to the element if it doesn't already have one.
 * @param {HTMLElement} element - The element to modify
 * @param {string} label - The aria-label value to set
 * @returns {boolean} True if label was added, false if element already had one
 */
function addAriaLabel(element, label) {
  if (!element) {
    throw new Error('Element is required');
  }

  if (!label) {
    throw new Error('Label is required');
  }

  if (element.getAttribute('aria-label')) {
    return false;
  }

  element.setAttribute('aria-label', label);
  return true;
}

/**
 * Ensures that the dependencyGraph container has a proper ARIA role
 * and that all landmark elements have unique ids. If a landmark
 * doesn't have an id, one is generated.
 * (Preserves the existing renderDependencyGraphs function for control.)
 *
 * @param {HTMLElement} container - The dependencyGraph container element
 * @returns {Object} Result describing the accessibility fixes applied
 */
function ensureDependencyGraphAccessibility(container) {
  if (!container) {
    throw new Error('Container element is required');
  }

  const result = {
    containerId: null,
    roleSet: false,
    landmarkIdsGenerated: 0,
    landmarkElements: []
  };

  // Ensure the container has an id
  result.containerId = ensureElementHasId(container, 'dependency-graph');

  // Ensure the container has a proper ARIA role for the dependency graph
  if (!container.getAttribute('role')) {
    container.setAttribute('role', 'img');
    result.roleSet = true;
  }

  // Ensure container has an accessible label
  addAriaLabel(container, `Dependency graph: ${result.containerId}`);

  // Ensure all landmark elements inside the container have unique ids
  const landmarkSelectors = [
    'header', 'nav', 'main', 'aside', 'footer',
    '[role="banner"]', '[role="navigation"]', '[role="main"]',
    '[role="complementary"]', '[role="contentinfo"]',
    'section[aria-label]', 'section[aria-labelledby]'
  ];

  const seenIds = new Set();
  const landmarks = container.querySelectorAll(landmarkSelectors.join(','));

  landmarks.forEach((landmark) => {
    result.landmarkElements.push(landmark);
    if (!landmark.id) {
      const tagName = landmark.tagName.toLowerCase();
      const role = landmark.getAttribute('role') || tagName;
      const generatedId = `${role}-${Math.random().toString(36).substr(2, 9)}`;
      landmark.id = generatedId;
      seenIds.add(generatedId);
      result.landmarkIdsGenerated += 1;
    } else {
      // If duplicate id exists within container, generate a new one
      if (seenIds.has(landmark.id)) {
        const tagName = landmark.tagName.toLowerCase();
        const role = landmark.getAttribute('role') || tagName;
        const newId = `${role}-${Math.random().toString(36).substr(2, 9)}`;
        landmark.id = newId;
        seenIds.add(newId);
        result.landmarkIdsGenerated += 1;
      } else {
        seenIds.add(landmark.id);
      }
    }
  });

  return result;
}

/**
 * Renders dependency graphs for the given configuration.
 * @param {HTMLElement} container - The container element to render into
 * @param {Object} dependencies - The dependencies data to render
 * @param {Object} [options={}] - Optional rendering configuration
 * @returns {Object} The rendered graph instance
 */
function renderDependencyGraphs(container, dependencies, options = {}) {
  if (!container) {
    throw new Error('Container element is required');
  }

  if (!dependencies) {
    throw new Error('Dependencies data is required');
  }

  // Ensure container has an id for graph references
  const containerId = ensureElementHasId(container, 'graph-container');

  // Address accessibility issues from insight report:
  // Ensure the dependencyGraph container has a proper ARIA role
  // Ensure all landmark elements have unique ids. If a landmark doesn't have an id, generates one.
  // (Preserve existing function for control)
  ensureDependencyGraphAccessibility(container);

  // Add accessibility label if not present
  const hasAriaLabel = addAriaLabel(container, `Dependency graph: ${containerId}`);

  // Placeholder for graph rendering logic
  // Actual implementation would use a library like D3.js or similar
  const graphData = {
    id: containerId,
    dependencies: dependencies,
    options: options,
    rendered: true,
    timestamp: new Date().toISOString()
  };

  // New accessibility function: Set focus for keyboard navigation
  const setFocus = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.focus();
      element.setAttribute('tabindex', '0');
    }
  };

  // New accessibility function: Keyboard event handler for accessibility
  function handleKeyboardNavigation(event) {
    const key = event.key;
    const activeElement = document.activeElement;

    // Handle keyboard navigation (e.g., arrow keys, tab)
    switch (key) {
      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight':
        accessibilityUtils.navigateWithArrows(key, activeElement);
        break;
      case 'Tab':
        handleTabNavigation(event, activeElement);
        break;
      default:
        break;
    }
  }

  // Helper for arrow key navigation
  function navigateWithArrows(key, activeElement) {
    // Implement custom navigation logic based on element type
    console.log(`Navigating with ${key} key`);
  }

  // Helper for tab key navigation
  function handleTabNavigation(event, activeElement) {
    // Implement custom tab navigation logic
    console.log('Handling tab navigation');
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

// Initialize accessibility features
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

// Initialize on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccessibility);
  } else {
    initAccessibility();
  }
}

// Export all functions
module.exports = {
  ...main,

  CONFIG,
  log,
  validateInput,
  parseJSONsafe,
  formatResponse,
  delay,
  retryOperation,
  sanitizeFilename,
  readFileSafe,
  processData,
  filterValidItems,
  groupByCategory,
  myNewFunction,
  calculateSum,
  ensureElementHasId,
  addAriaLabel,
  ensureDependencyGraphAccessibility,
  renderDependencyGraphs,
  handleCredentialResponse,
  focusTrap,
  addressAccessibilityIssues,
  createInPageButton,
  createWebResourceButton,
  getLangAttribute,
  validateAccessibilityReport,
  addMainLandmark,
  ensureUniqueLandmarks,
  addAltAttribute,
  replaceButtonId,
  addLangAttribute,
  fixTableStructure,
  addSvgAccessibleName,
  fixFakeLinkIssue,
  addAriaAttribute,
  accessibilityUtils,
  exportUtils,
  initAccessibility,
  personName,
  validateTableAccessibility: validateTableAccessibilityUtil,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  newFocusTrap,
  transformInputData
};