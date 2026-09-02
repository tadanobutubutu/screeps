const main = require('./utilities');

const { createInPageButton, createWebResourceButton, validateTableAccessibility, validateTableStructure, validateLandmark, validateLandmarkStructure, getSvgAccessibleName, getLangAttribute, validateAccessibilityReport, exportUtils, addressAccessibilityIssues, handleCredentialResponse, ensureElementHasId, ensureElementHasIdOrigin, addAriaLabel, renderDependencyGraphs, fixButtonIdentifiers, fixDependencyGraphAria, addMainLandmarkToIndex, focusTrap } = main;

// Accessibility utilities and functions
const accessibilityUtils = {
  // Initialize skip link functionality for keyboard navigation
  initSkipLink: () => {
    const skipLink = document.getElementById('skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.getElementById(skipLink.getAttribute('href').slice(1));
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
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
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

  // New focus trap function
  newFocusTrap: (element) => {
    if (!element) return;
    const focusable = element.querySelectorAll(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
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
  },
};

// Utility functions for ensuring elements have IDs and adding labels
const ensureElementId = (element) => {
  if (element && !element.id) {
    element.id = `generated-id-${Math.random().toString(36).substr(2, 9)}`;
  }
  return element;
};

// Required changes to fix the React SVG Accessible Name issue
const addSvgAccessibleName = function addSvgAccessibleName(svgString, label) {
  // This function adds an `aria-label` attribute to the SVG if it doesn't already have one
  // and returns the modified SVG string.
  // Note: This is a simplified example and might need adjustments based on the actual SVG structure.
  try {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgString, "image/svg+xml");
    const svgElement = svgDoc.documentElement;
    if (!svgElement.hasAttribute('aria-label')) {
      svgElement.setAttribute('aria-label', label || 'Descriptive label for SVG');
    }
    const serializer = new XMLSerializer();
    return serializer.serializeToString(svgElement);
  } catch (error) {
    console.error('Error processing SVG:', error);
    return svgString;
  }
};

// Alias for getSvgAccessibleName to maintain backward compatibility
function getSvgAccessibleName(svgString) {
  return addSvgAccessibleName(svgString);
}

// New function to handle accessibility issues
function handleAccessibilityIssues() {
  // Code to handle accessibility issues as per the insight report
  getLangAttribute();
  validateTableAccessibility();
  validateTableStructure();
  validateLandmark();
  validateLandmarkStructure();
  ensureUniqueLandmarks();
  getSvgAccessibleName();
  createInPageButton();
  createAccessibleLink();
}

// New utility functions

/**
 * Formats a dependency version string for display
 * @param {string} version - Version string
 * @returns {string} Formatted version
 */
function formatVersion(version) {
  if (!version) return 'latest';
  return version.startsWith('v') ? version : `v${version}`;
}

/**
 * Sanitizes a string for safe HTML rendering
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
function sanitizeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Creates an accessible button element in the document
 */
function createInPageButton() {
  const btn = document.createElement('button');
  btn.setAttribute('type', 'button');
  btn.setAttribute('aria-label', 'Open in new tab');
  btn.textContent = 'Open';
  document.body.appendChild(btn);
  return btn;
}

/**
 * Creates an accessible link element in the document
 */
function createAccessibleLink() {
  const a = document.createElement('a');
  a.setAttribute('href', '#');
  a.setAttribute('aria-label', 'Go to home page');
  a.textContent = 'Home';
  document.body.appendChild(a);
  return a;
}

// Example usage of the function
const originalSvgString = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y="0.9em" dy=".35em" x="50%" text-anchor="middle" class="sim-title" font-size="17">Screeps Dashboard</text></svg>';
const modifiedSvgString = addSvgAccessibleName(originalSvgString, 'Screeps Dashboard');

/**
 * Validates table accessibility
 * @param {Array} tableData - Table data to validate
 * @returns {boolean} True if table is accessible, false otherwise
 */
function validateTableAccessibility(tableData) {
  // Implementation placeholder - function to be implemented
  return true;
}

/**
 * Validates table structure
 * @param {Array} tableData - Table data to validate
 * @returns {boolean} True if table structure is valid, false otherwise
 */
function validateTableStructure(tableData) {
  // Implementation placeholder - function to be implemented
  return true;
}

function renderIndexView(data, options = {}) {
  const {
    container = null,
    template = null,
    itemRenderer = null,
    emptyMessage = 'No items to display',
    className = 'index-view',
    ariaLabel = 'Index view'
  } = options;

  if (!data || !Array.isArray(data) || data.length === 0) {
    if (container) {
      container.innerHTML = `<div class="${className}-empty" aria-live="polite">${emptyMessage}</div>`;
    }
    return `<div class="${className}-empty" aria-live="polite">${emptyMessage}</div>`;
  }

  const renderItem = itemRenderer || ((item) => {
    if (typeof item === 'object' && item !== null) {
      return `<div class="${className}-item" data-id="${item.id || ''}">${JSON.stringify(item)}</div>`;
    }
    return `<div class="${className}-item">${String(item)}</div>`;
  });

  const itemsHtml = data.map(renderItem).join('');
  const html = `
    <div class="${className}" role="list" aria-label="${ariaLabel}">
      ${itemsHtml}
    </div>
  `;

  if (container) {
    container.innerHTML = html;
    // Announce to screen readers
    accessibilityUtils.announceToScreenReader(`Index view rendered with ${data.length} items`);
  }

  return html;
}

/**
 * Function to handle additional rendering logic using new functions for rendering graph/index
 * @param {HTMLElement|string} container - Container element or selector
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

  // Use renderDependencyGraphs function from utilities
  const graphHtml = renderDependencyGraphs(container, {
    ...mergedOptions,
    onRender: (graphData) => {
      // Apply accessibility fixes to the rendered graph
      if (addressAccessibilityIssues) {
        addressAccessibilityIssues(graphData);
      }
    }
  });

  // Apply additional accessibility improvements using new functions
  const fixedHtml = fixDependencyGraphAria(graphHtml);

  // Ensure all elements have proper IDs for accessibility
  const tempContainer = document.createElement('div');
  tempContainer.innerHTML = fixedHtml;
  const elements = tempContainer.querySelectorAll('button, a, [role="button"]');
  elements.forEach((element, index) => {
    if (!element.id) {
      element.id = `graph-element-${index}`;
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
  // Implementation of the new function
  // Placeholder for actual implementation
  return '<div class="additional-content"></div>';
}

// Accessibility-related functions
function addLangAttribute() {
  // Implementation for adding lang attribute to HTML element
  // This would typically be done in the HTML template, not in JavaScript
  // For the purpose of this exercise, we'll assume it's handled elsewhere
}

function fixTableStructureIssues() {
  // Implementation for fixing table structure issues
  // This would typically involve ensuring proper table semantics
}

function addMainLandmark() {
  // Implementation for adding/fixing landmark issues
  // This would typically involve ensuring proper ARIA landmarks
}

function ensureUniqueLandmarks() {
  if (typeof document === 'undefined') {
    return [];
  }

  const issues = [];
  const landmarks = ['main', 'nav', 'aside', 'header', 'footer', 'section', 'article', 'form'];
  const uniqueLandmarks = ['main', 'banner', 'contentinfo'];
  
  uniqueLandmarks.forEach(role => {
    const elements = document.querySelectorAll(`[role="${role}"], ${role}`);
    if (elements.length > 1) {
      issues.push(`Multiple ${role} landmarks found - should be unique`);
    }
  });

  return issues;
}

function fixFakeLinkIssue() {
  // Implementation for fixing fake link issues
  // This would typically involve ensuring links are actual links or have proper ARIA roles
}

module.exports = {
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
  ...main,
  ...accessibilityUtils,
  ensureElementId,
  ensureElementHasId,
  getLangAttribute,
  personName,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  createInPageButton,
  generateAccessibilityReport,
  newFocusTrap,
  renderGraphIndex,
  renderDependencyGraphs,
  renderAdditionalContent,
  addAccessibleName: addSvgAccessibleName,
  addAriaLabel,
  focusTrap,
  formatVersion,
  sanitizeHtml,
  createAccessibleLink,
  renderIndexView,
  handleAccessibilityIssues,
};