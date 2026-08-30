// Accessibility utilities and functions
const accessibilityUtils = {
  initSkipLink: function() { /* existing implementation */ },
  trapFocus: function(element) { /* existing implementation */ },
  announceToScreenReader: function(message, priority) { /* existing implementation */ },
  handleKeyboardNav: function(e, handlers) { /* existing implementation */ },
  newFocusTrap: function() {
    const focusableElements = this.getFocusableElements(element);
    let focusIndex = focusableElements.indexOf(document.activeElement);

    function focus(newFocusIndex) {
      if (newFocusIndex < 0) {
        newFocusIndex = focusableElements.length - 1;
      }
      if (newFocusIndex >= focusableElements.length) {
        newFocusIndex = 0;
      }
      focusableElements[newFocusIndex].focus();
    }

    window.addEventListener('keydown', function(event) {
      switch (event.key) {
        case 'Tab':
          if (event.shiftKey) {
            focus(--focusIndex);
          } else {
            focus(++focusIndex);
          }
          break;
        default:
          break;
      }
    });

    focus(focusIndex); // set initial focus
  },

  getFocusableElements: function(element) {
    const focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    return [...focusableElements];
  }
};

// Functions to ensure the element has an id, add aria-label, render dependency graphs (previously existing code)

function ensureElementId(element) { /* existing implementation */ }
function addAriaLabel(element, label) { /* existing implementation */ }
function renderDependencyGraph(data) { /* existing implementation */ }

// New function for focus trap
accessibilityUtils.newFocusTrap = accessibilityUtils.newFocusTrap || accessibilityUtils.trapFocus;

// Functions added from the conflict resolution
function calculateSum(a, b) {
  return a + b;
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

function transformInputData(inputData, options) {
  if (options === undefined) {
    options = {};
  }

  const preserveKeys = options.preserveKeys !== undefined ? options.preserveKeys : true;
  const uppercase = options.uppercase === true;
  const trimWhitespace = options.trimWhitespace !== false;
  const maxLength = options.maxLength || null;

  if (!inputData) {
    return null;
  }

  let result = inputData;

  // Apply trim whitespace if needed
  if (trimWhitespace && typeof result === 'string') {
    result = result.trim();
  }

  // Apply uppercase if needed
  if (uppercase && typeof result === 'string') {
    result = result.toUpperCase();
  }

  // Apply max length if needed
  if (maxLength && typeof result === 'string' && result.length > maxLength) {
    result = result.substring(0, maxLength);
  }

  return result;
}

// Existing utility functions
function log(message, level) { /* existing implementation */ }

// Export functionality with accessibility support
const exportUtils = {
  // Existing exports
  exportData: function(data, filename, mimeType) { /* existing implementation */ },
  exportToJSON: function(data, filename) { /* existing implementation */ },
  exportToCSV: function(data, filename) { /* existing implementation */ },
  sanitizeFilename: sanitizeFilename,
  readFileSafe: readFileSafe,

  // New export
  groupByCategory: groupByCategory
};

// Existing data processing functions
function processData(items) { /* existing implementation */ },
function filterValidItems(items, validator) { /* existing implementation */ }

// Initialize accessibility features
function initAccessibility() { /* existing implementation*/ }

// Add the new 'transformInputData' function to the module exports
module.exports = {
  accessibilityUtils: accessibilityUtils,
  exportUtils: exportUtils,
  initAccessibility: initAccessibility,
  handleCredentialResponse: handleCredentialResponse,
  ensureElementId: ensureElementId,
  addAriaLabel: addAriaLabel,
  renderDependencyGraph: renderDependencyGraph,
  calculateSum: calculateSum,
  transformInputData: transformInputData,
  processData: processData,
  filterValidItems: filterValidItems
};