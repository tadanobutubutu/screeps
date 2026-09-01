// TODO: This is the existing code that needs to be preserved
// Addressed accessibility issues from insight report

// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
// TODO: Import required modules and export the new necessary functions here in main.js (preserving the original code)

const { createInPageButton, createWebResourceButton, validateTableAccessibility, validateTableStructure, validateLandmark, validateLandmarkStructure, getSvgAccessibleName, getLangAttribute, validateAccessibilityReport } = require('./utilities');
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

  console.log('Rendering dependency graphs:', graphData);

  return graphData;
}

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

// TODO: Implement a new function to handle focus trap for keyboard navigation
const focusTrap = (element) => {
  const focusableElements = element.querySelectorAll(
    'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  let activeElementIndex = focusableElements.length - 1;

  function setActiveElement(index) {
    if (index < 0) {
      index = focusableElements.length - 1;
    } else if (index >= focusableElements.length) {
      index = 0;
    }

    if (focusableElements[index]) {
      focusableElements[index].focus();
    } else {
      element.focus();
    }
    activeElementIndex = index;
  }

  function nextFocusableElement() {
    setActiveElement(activeElementIndex + 1);
  }

  function previousFocusableElement() {
    setActiveElement(activeElementIndex - 1);
  }

  function moveFocusToFirst() {
    setActiveElement(0);
  }

  function moveFocusToLast() {
    setActiveElement(focusableElements.length - 1);
  }

  element.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'Tab':
        if (e.shiftKey) {
          previousFocusableElement();
        } else {
          nextFocusableElement();
        }
        e.preventDefault();
        break;
      case 'ArrowLeft':
        previousFocusableElement();
        e.preventDefault();
        break;
      case 'ArrowRight':
        nextFocusableElement();
        e.preventDefault();
        break;
      case 'Home':
        moveFocusToFirst();
        e.preventDefault();
        break;
      case 'End':
        moveFocusToLast();
        e.preventDefault();
        break;
    }
  });
};

// TODO: Address accessibility issues from insight report
const addressAccessibilityIssues = (container) => {
  const fixes = {
    langAdded: false,
    mainLandmarkAdded: false,
    landmarksFixed: 0,
    svgNamesAdded: 0,
    fakeLinksFixed: 0
  };

  if (fixes.langAdded) {
    log('Lang attribute added to HTML element', 'info');
  }

  if (fixes.mainLandmarkAdded) {
    log('Main landmark added', 'info');
  }

  const landmarkFixes = fixes.landmarksFixed || 0;
  if (landmarkFixes > 0) {
    log(`Fixed ${landmarkFixes} unique landmarks`, 'info');
  }

  const svgFixes = fixes.svgNamesAdded || 0;
  if (svgFixes > 0) {
    log(`Fixed accessible names for ${svgFixes} SVGs`, 'info');
  }

  const fakeLinkFixes = fixes.fakeLinksFixed || 0;
  if (fakeLinkFixes > 0) {
    log(`Fixed fake link issues for ${fakeLinkFixes} elements`, 'info');
  }

  return fixes;
};

// Functions for data transformation
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
      const hasHeaderCells = Array.from(cells).some(cell =>
        cell.tagName.toLowerCase() === 'th'
      );
      isValid = isValid && hasHeaderCells;
    } else {
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

  const landmarks = ['header', 'nav', 'main', 'aside', 'footer', 'form', 'section'];
  if (landmarks.includes(tagName)) {
    return true;
  }

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
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  newFocusTrap,
  transformInputData
};