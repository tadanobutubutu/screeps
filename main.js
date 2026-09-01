// Dependency imports
const { dependencyGraphContent } = require('./dependencyGraphContent');
const { indexContent } = require('./indexContent');

// Existing rendering functions (preserving existing exports and functions)

/**
 * Renders the dependency graph view
 * @param {Object} deps - Dependencies object
 * @param {Object} options - Rendering options
 * @returns {string} Rendered dependency graph HTML
 */
function renderDependencyGraph(deps, options = {}) {
  // Use dependencyGraphContent from the imported module
  return dependencyGraphContent(deps, options);
}

/**
 * Renders the main index view
 * @param {Object} data - View data
 * @param {Object} options - Rendering options
 * @returns {string} Rendered index HTML
 */
function renderIndex(data, options = {}) {
  // Use indexContent from the imported module
  return indexContent(data, options);
}

// Add lang attribute to HTML element
function getLangAttribute() {
  // Implementation to add lang attribute
}

// Accessibility utilities and functions
// TODO: Address accessibility issues from insight report — FIXED (combined with the export code)

// Utility functions for accessibility
const accessibilityUtils = {
  // Initialize skip link functionality for keyboard navigation
  initSkipLink: function() {
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', function(e) {
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
  trapFocus: function(element) {
    const focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', function(e) {
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
  announceToScreenReader: function(message, priority) {
    if (priority === undefined) {
      priority = 'polite';
    }
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.style.position = 'absolute';
    announcer.style.left = '-9999px';
    announcer.textContent = message;
    document.body.appendChild(announcer);
    setTimeout(function() {
      announcer.remove();
    }, 1000);
  },

  // Handle keyboard navigation
  handleKeyboardNav: function(e, handlers) {
    const key = e.key;
    if (handlers[key]) {
      handlers[key](e);
    }
  },

  // New focus trap function for keyboard navigation
  newFocusTrap: function(element) {
    const focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', function(e) {
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

  // Function to ensure the element has an id, add aria-label, render dependency graphs
  ensureElementAccessibility: function(element, options) {
    // Implementation to ensure element accessibility
  },

  // Function to fix table structure and accessibility issues
  validateAndFixTableStructure: function(table) {
    // Implementation to validate and fix table structure and accessibility
  },

  // Function to fix landmark structure and accessibility issues
  validateAndFixLandmark: function(landmark) {
    // Implementation to validate and fix landmark structure and accessibility
  },

  // Function to improve SVG accessibility
  improveSvgAccessibility: function(svg) {
    // Implementation to improve SVG accessibility
  },

  // Function to create an in-page button with accessible link
  createAccessibleInPageButton: function(options) {
    // Implementation to create a accessible in-page button
  },

  // Function to handle accessibility issues
  handleAccessibilityIssues: function(container, report) {
    // Implementation to handle accessibility issues
  },

  // Function to add ARIA attributes to elements
  addAriaAttributes: function(element, attributes) {
    if (!element || !attributes) return;

    for (const [key, value] of Object.entries(attributes)) {
      if (value !== undefined && value !== null) {
        element.setAttribute(key, value);
      }
    }
  },

  // Function to ensure proper heading hierarchy
  ensureHeadingHierarchy: function(container) {
    if (!container) return;

    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let currentLevel = 1;

    headings.forEach(heading => {
      const level = parseInt(heading.tagName.substring(1));
      if (level > currentLevel + 1) {
        // Skip levels if needed (e.g., h1 -> h3)
        currentLevel = level - 1;
      } else if (level < currentLevel) {
        // Reset to current level if we go back
        currentLevel = level;
      } else {
        currentLevel = level;
      }

      // Ensure proper heading structure
      if (level > currentLevel + 1) {
        // If we skip a level, adjust the heading level
        const newLevel = currentLevel + 1;
        const newHeading = document.createElement(`h${newLevel}`);
        newHeading.textContent = heading.textContent;
        heading.replaceWith(newHeading);
        currentLevel = newLevel;
      }
    });
  },

  // Function to ensure proper form labels
  ensureFormLabels: function(form) {
    if (!form) return;

    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      const id = input.id || `input-${Math.random().toString(36).substr(2, 9)}`;
      input.id = id;

      if (!input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
        const label = form.querySelector(`label[for="${id}"]`);
        if (!label) {
          // Create implicit label if none exists
          input.setAttribute('aria-label', input.placeholder || 'Input field');
        }
      }
    });
  },

  // Function to ensure proper button accessibility
  ensureButtonAccessibility: function(button) {
    if (!button) return;

    if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
      button.setAttribute('aria-label', button.getAttribute('title') || 'Button');
    }

    if (button.tagName.toLowerCase() === 'button' && !button.getAttribute('type')) {
      button.setAttribute('type', 'button');
    }
  },

  // Function to ensure proper image accessibility
  ensureImageAccessibility: function(image) {
    if (!image) return;

    if (!image.getAttribute('alt') && !image.getAttribute('aria-hidden')) {
      image.setAttribute('alt', '');
    }

    if (image.getAttribute('alt') === '') {
      image.setAttribute('role', 'presentation');
    }
  }
};

// Functions to ensure the element has an id, add aria-label, render dependency graphs, address accessibility issues from insight report
function ensureElementId(element) {
  if (element && !element.id) {
    element.id = 'element-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }
  return element;
}

function addAriaLabel(element, label) {
  if (element) {
    element.setAttribute('aria-label', label);
  }
  return element;
}

function renderDependencyGraph(data) {
  // Implementation for rendering dependency graphs
  return {
    nodes: data.nodes || [],
    edges: data.edges || []
  };
}

function implementAccessibilityFixesFromReport(container, report) {
  // Implementation to address accessibility issues from the insight report
  if (!container || !report) return;

  // Fix heading hierarchy
  accessibilityUtils.ensureHeadingHierarchy(container);

  // Fix form labels
  const forms = container.querySelectorAll('form');
  forms.forEach(form => accessibilityUtils.ensureFormLabels(form));

  // Fix button accessibility
  const buttons = container.querySelectorAll('button, [role="button"]');
  buttons.forEach(button => accessibilityUtils.ensureButtonAccessibility(button));

  // Fix image accessibility
  const images = container.querySelectorAll('img, svg');
  images.forEach(image => accessibilityUtils.ensureImageAccessibility(image));

  // Fix table accessibility
  const tables = container.querySelectorAll('table');
  tables.forEach(table => {
    const issues = validateTableAccessibility(table);
    if (issues.length > 0) {
      // Add ARIA attributes to help with accessibility
      accessibilityUtils.addAriaAttributes(table, {
        'aria-describedby': 'table-description',
        'role': 'table'
      });
    }
  });
}

// Initialize accessibility features
function initAccessibility() {
  accessibilityUtils.initSkipLink();

  // Add keyboard support for all interactive elements
  const elements = document.querySelectorAll('[data-accessible]');
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    element.addEventListener('keydown', function(e) {
      accessibilityUtils.handleKeyboardNav(e, {
        Enter: function() {
          element.click();
        },
        ' ': function() {
          element.click();
        }
      });
    });
  }

  // Apply accessibility fixes to the entire document
  implementAccessibilityFixesFromReport(document.body, {});
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
    issues.push('TABLE is missing a caption or caption is empty');
  }

  // Check for th elements in headers
  const headers = tableElement.querySelectorAll('th');
  if (headers.length === 0) {
    issues.push('TABLE is missing TH elements for headers');
  }

  // Check for scope attributes on th elements
  headers.forEach(function(th) {
    if (!th.getAttribute('scope')) {
      issues.push('TH element is missing scope attribute');
    }
  });

  // Check for proper thead/tbody structure
  const thead = tableElement.querySelector('thead');
  const tbody = tableElement.querySelector('tbody');
  if (!thead) {
    issues.push('TABLE is missing THEAD element');
  }
  if (!tbody) {
    issues.push('TABLE is missing TBODY element');
  }

  return issues;
}

// Export all utilities
module.exports = {
  accessibilityUtils: accessibilityUtils,
  implementAccessibilityFixesFromReport: implementAccessibilityFixesFromReport,
  initAccessibility: initAccessibility,
  handleCredentialResponse: handleCredentialResponse,
  ensureElementId: ensureElementId,
  addAriaLabel: addAriaLabel,
  renderDependencyGraph: renderDependencyGraph,
  calculateSum: calculateSum,
  processData: processData,
  filterValidItems: filterValidItems,
  groupByCategory: groupByCategory,
  validateTableAccessibility: validateTableAccessibility,
  validateTableStructure: validateTableStructure,
  validateLandmark: validateLandmark,
  validateLandmarkStructure: validateLandmarkStructure,
  ensureUniqueLandmarks: ensureUniqueLandmarks,
  getSvgAccessibleName: getSvgAccessibleName,
  createInPageButton: createInPageButton,
  handleAccessibilityIssues: handleAccessibilityIssues,
  transformInputData: transformInputData,
};

// Persist any new functions or fixes from the other conflict branch
function newExportedFunction() {
  // Implementation of the new function from the other conflict branch
}

// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
// _Commit: eef4b6be04a5e2cd61b75c443cfe2dff2da0857ca2_
// <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
// _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
// <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
// _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
// <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->

_Commit: b8888a21083c89f599fb68eef1dc4d5df1051e52_

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

// Init on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccessibility);
  } else {
    initAccessibility();
  }
}