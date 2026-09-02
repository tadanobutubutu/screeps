const fs = require('fs');
const url = require('url');

// Dependency imports
const { dependencyGraphContent, indexContent } = require('./dependencyContent');
const {
  createInPageButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  getLangAttribute,
  validateAccessibilityReport,
  announceToScreenReader,
  handleKeyboardNav,
  newFocusTrap: originNewFocusTrap,
  exportUtils,
  addressAccessibilityIssues,
  handleCredentialResponse,
  ensureElementHasId: ensureElementIdOrigin,
  ensureElementId: ensureElementIdFromMain,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  focusTrap,
  transformInputData
} = require('./utilities');

// TODO: This is the existing code that needs to be preserved
// ----- BEGIN ORIGINAL CODE (unchanged) -----

const accessibilityUtils = {
  initSkipLink: () => {},
  trapFocus: (element) => {},
  createInPageButton,
  createWebResourceButton: (options) => {},
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  getLangAttribute,
  validateAccessibilityReport,
  announceToScreenReader,
  handleKeyboardNav,
  newFocusTrap: originNewFocusTrap,
  exportUtils,
  personName: () => {},
  transformInputData,
  ensureElementId: (element) => {
    if (element && !element.id) {
      element.id = "element-" + Date.now() + "-" + Math.random().toString(36).slice(2, 11);
    }
    return element;
  },
  addAriaLabel: (element, label) => {
    if (element) {
      element.setAttribute('aria-label', label);
    }
    return element;
  }
};

function calculateSum(a, b) { return a + b; }

accessibilityUtils.initSkipLink = () => {
  const skipLink = document.querySelector('.skip-link');
  if (!skipLink) {
    const skipContainer = document.createElement('div');
    skipContainer.id = 'skip-link';
    skipContainer.className = 'sr-only';
    skipContainer.style.position = 'fixed';
    skipContainer.style.top = '0';
    skipContainer.style.left = '0';
    skipContainer.style.width = '100%';
    skipContainer.style.height = '100%';
    skipContainer.style.zIndex = '99999';

    const skipLinkElement = document.createElement('a');
    skipLinkElement.href = '#main-content';
    skipLinkElement.textContent = 'Skip to main content';
    skipLinkElement.ariaLabel = 'Skip to main content';
    skipContainer.appendChild(skipLinkElement);
    document.body.appendChild(skipContainer);
  }
};

accessibilityUtils.trapFocus = (element) => {
  if (!element) {
    return () => {};
  }

  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );

  if (focusableElements.length === 0) {
    console.warn('No focusable elements found in container');
    return;
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
      element.dispatchEvent(new KeyboardEvent('escape'));
    }
  };

  element.addEventListener('keydown', handleKeyDown);

  // Return cleanup function
  return () => {
    element.removeEventListener('keydown', handleKeyDown);
  };
};

// Credential response handling - uses the imported function from main

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
    announceToScreenReader("Download of " + filename + " started");
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
  return filename.replace(/[^a-z0-9.-]/gi, '_');
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
  document.querySelectorAll('button, a, input, select, textarea').forEach(element => {
    element.addEventListener('keydown', (e) => {
      const handlers = {
        Enter: () => element.click(),
        ' ': () => element.click()
      };
      if (handlers[e.key]) {
        handlers[e.key]();
      }
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

// Accessibility-related functions
function ensureDependencyGraphARIA() {
  const dependencyGraphElement = document.querySelector('.dependency-graph');
  if (dependencyGraphElement) {
    // Set appropriate ARIA role for the dependency graph container
    if (!dependencyGraphElement.getAttribute('role')) {
      dependencyGraphElement.setAttribute('role', 'region');
    }

    // Add accessible label if not already present
    if (!dependencyGraphElement.getAttribute('aria-label')) {
      dependencyGraphElement.setAttribute('aria-label', 'Dependency graph visualization');
    }
  }
}

const initiateAnnounceToScreenReader = (message, priority) => {
  announceToScreenReader(message, priority);
  announcementDelayHandler();
};

const announcementDelayHandler = () => {
  setTimeout(() => {
    const announcer = document.querySelector('#sr-announcer');
    if (announcer) {
      document.body.removeChild(announcer);
    }
  }, 1000);
};

function handleKeyboardNav(e, handlers) {
  handleKeyboardNav(e, handlers);
  handleKeyboardNavKeyDownEvent(e, handlers);
}

const handleKeyboardNavKeyDownEvent = (e, handlers) => {
  if (e.key === 'Tab') {
    Object.values(handlers).forEach((handler) => {
      if (handler) {
        handler(e);
      }
    });
  }
};

const newFocusTrap = (element) => {
  const focusZone = newFocusTrap(element, { allowFocusOut: false });
  return { focus, blur, update } => {
    focusZone.focus();
    focusZone.on('focusout', () => focusZone.update());
  };
};

// Required changes to fix the React SVG Accessible Name issue
const addSvgAccessibleName = function(svgString, label) {
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgString, "image/svg+xml");
  const svgElement = svgDoc.documentElement;
  if (!svgElement.hasAttribute('aria-label') && !svgElement.hasAttribute('aria-labelledby')) {
    svgElement.setAttribute('aria-label', label || 'Descriptive label for SVG');
  }
  const serializer = new XMLSerializer();
  return serializer.serializeToString(svgDoc);
};

/**
 * Function to handle additional rendering logic using new functions for rendering graph/index
 * @param {string|HTMLElement} container - Container element or selector
 * @param {Object} options - Options for rendering
 * @param {string} options.title - Title for the graph/index view
 * @param {string} options.graphType - Type of graph to render
 * @param {boolean} options.showLegend - Whether to show legend
 * @returns {string} Rendered HTML content
 */
function renderGraphIndex(container, options = {}) {
  const defaultOptions = {
    title: 'Dependency Graph',
    graphType: 'dependency',
    showLegend: true
  };

  const mergedOptions = { ...defaultOptions, ...options };

  const graphHtml = renderDependencyGraphs(container, {
    ...mergedOptions,
    onRender: (graphData) => {
      if (addressAccessibilityIssues) {
        // Apply accessibility fixes here
      }
    }
  });

  const fixedHtml = addSvgAccessibleName(graphHtml, mergedOptions.title);

  const tempContainer = document.createElement('div');
  tempContainer.innerHTML = fixedHtml;
  const elements = tempContainer.querySelectorAll('a, [role="button"]');
  elements.forEach((element, index) => {
    if (!element.id) {
      element.id = `accessible-element-${index}`;
    }
  });

  return tempContainer.innerHTML;
}

/**
 * New function to handle additional rendering logic
 * @param {Object} additionalData - Additional data for rendering
 * @returns {string} Rendered additional content HTML
 */
function renderAdditionalContent(additionalData) {
  return '<div class="additional-content">' + (additionalData ? additionalData.content : '') + '</div>';
}

// Accessibility-related functions
function addLangAttribute() {
  // Implementation for adding lang attribute to HTML element
}

function fixTableStructureIssues() {
  // Implementation for fixing table structure issues
}

function addMainLandmark() {
  // Implementation for adding/fixing landmark issues
}

function addSvgAccessibleNameToElement() {
  // Implementation for adding accessible names to SVGs
}

function ensureUniqueLandmarks() {
  if (typeof document === 'undefined') {
    return [];
  }

  const issues = [];
  const landmarks = ['main', 'nav', 'aside', 'header', 'footer', 'section', 'article', 'form'];
  
  landmarks.forEach(role => {
    const elements = document.querySelectorAll(`[role="${role}"]`);
    if (elements.length > 1) {
      issues.push(`Multiple ${role} landmarks found - should be unique`);
    }
  });

  return issues;
}

function fixFakeLinkIssue() {
  // Implementation for fixing fake link issues
}

// Additional utility functions
function ensureElementId(element, baseId) {
  if (!element.id) {
    element.id = baseId || `element-${Date.now()}`;
  }
  return element.id;
}

function ensureElementHasId(element) {
  if (!element.id) {
    element.id = `element-${Math.random().toString(36).substr(2, 9)}`;
  }
  return element.id;
}

function getLangAttribute() {
  return document.documentElement ? document.documentElement.lang : '';
}

function personName() {
  return document.querySelector('[data-person-name]') ? document.querySelector('[data-person-name]').textContent : '';
}

function validateTableStructure(table) {
  const issues = [];
  if (!table.querySelector('thead') && !table.querySelector('th')) {
    issues.push('Table missing header cells');
  }
  return issues;
}

function validateLandmark(element) {
  const issues = [];
  const validLandmarks = ['main', 'nav', 'aside', 'header', 'footer', 'article', 'section', 'form'];
  if (element && !validLandmarks.includes(element.tagName.toLowerCase()) && !element.getAttribute('role')) {
    issues.push('Landmark missing proper semantics');
  }
  return issues;
}

function validateLandmarkStructure() {
  const issues = [];
  const mainElements = document.querySelectorAll('main, [role="main"]');
  if (mainElements.length === 0) {
    issues.push('Page missing main landmark');
  }
  return issues;
}

function getSvgAccessibleName(svgElement) {
  const title = svgElement.querySelector('title');
  if (title) return title.textContent;
  return svgElement.getAttribute('aria-label') || '';
}

function createInPageButton(text, onClick) {
  const button = document.createElement('button');
  button.textContent = text;
  button.addEventListener('click', onClick);
  return button;
}

function generateAccessibilityReport() {
  return {
    langAttribute: getLangAttribute(),
    tableIssues: [],
    landmarkIssues: validateLandmarkStructure(),
    svgNames: [],
    uniqueLandmarkIssues: ensureUniqueLandmarks()
  };
}

function focusTrap(element) {
  if (!element) return;
  return accessibilityUtils.newFocusTrap(element);
}

// Additional utility functions that might be referenced
function processData(data) {
  return data;
}

function calculateTotal(data) {
  return Array.isArray(data) ? data.reduce((sum, item) => sum + (item.value || 0), 0) : 0;
}

function formatResponse(data) {
  return JSON.stringify(data, null, 2);
}

function validateInput(data) {
  return data !== null && data !== undefined;
}

function transformData(data) {
  return Array.isArray(data) ? data.map(item => ({ ...item, transformed: true })) : [];
}

function mergeResults(results) {
  return results.reduce((acc, result) => ({ ...acc, ...result }), {});
}

module.exports = {
  ...accessibilityUtils,
  processData,
  calculateTotal,
  formatResponse,
  validateInput,
  transformData,
  mergeResults,
  addLangAttribute,
  fixTableStructureIssues,
  addMainLandmark,
  addSvgAccessibleName,
  ensureUniqueLandmarks,
  fixFakeLinkIssue,
  ensureElementId,
  ensureElementIdOrigin,
  ensureElementHasId,
  getLangAttribute,
  personName,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  createInPageButton,
  generateAccessibilityReport,
  renderDependencyGraphs,
  focusTrap,
  addAriaLabel,
  calculateSum,
  initAccessibility,
  groupByCategory,
  ensureDependencyGraphARIA,
  initiateAnnounceToScreenReader,
  handleKeyboardNavKeyDownEvent,
  newFocusTrap,
  exportUtilities,
  sanitizeFilename,
  readFileSafe,
  filterValidItems,
  renderGraphIndex,
  renderAdditionalContent,
  addSvgAccessibleNameToElement,
  addMainLandmarkToIndex,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  transformInputData,
  handleCredentialResponse
};