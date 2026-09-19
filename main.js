// main.js - Combined utility and accessibility features

// TODO: Address accessibility issues from insight report:
// - REACT_025: Ensure unique landmarks

// Accessibility helper function for keyboard navigation
function setupKeyboardNavigation(element, options = {}) {
  const { onEnter, onEscape, onArrowUp, onArrowDown } = options;
  
  element.addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'Enter':
        if (onEnter) onEnter(event);
        break;
      case 'Escape':
        if (onEscape) onEscape(event);
        break;
      case 'ArrowUp':
        if (onArrowUp) {
          event.preventDefault();
          onArrowUp(event);
        }
        break;
      case 'ArrowDown':
        if (onArrowDown) {
          event.preventDefault();
          onArrowDown(event);
        }
        break;
    }
  });
}

// Helper to manage focus within a container
function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  container.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  });
}

// Function to ensure landmarks have unique identifiers
function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('[role="region"]');
  let uniqueIds = [];

  function generateUniqueId() {
    return `landmark-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }

  landmarks.forEach((landmark) => {
    const existingIds = uniqueIds.map((id) => id.split('-')[1]);
    let id;

    while (existingIds.includes(landmark.id.split('-')[1])) {
      id = generateUniqueId();
    }

    uniqueIds.push(id);
    landmark.id = id;
  });
}

// Helper to manage focus within a container
function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  container.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  });
}

function groupByCategory(items, getCategory) {
  return items.reduce((groups, item) => {
    const category = getCategory(item);
    if (!groups[category]) {
      groups[category] = [];
    }
  };
}

// Check if user prefers reduced motion
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
function processData(items) { /* existing implementation */ }
function filterValidItems(items, validator) { /* existing implementation */ }

// Function to implement accessibility checks on tables
function checkTableAccessibility(table) {
  // Check if the table has a caption and if it's present
  if (!table.querySelector('caption')) {
    console.warn(`Table ${table.id} is missing a caption.`);
  }

  // Check if the table has scope attributes on th elements
  const headers = table.querySelectorAll('th');
  headers.forEach((th) => {
    if (!th.hasAttribute('scope')) {
      console.warn(`Table header ${th.id} is missing a 'scope' attribute.`);
    }
  });
}

// Initialize accessibility features
function initializeAccessibility() {
  const announcer = createAnnouncer();

  // Ensure all landmarks have unique IDs
  ensureUniqueLandmarks();

  // Check accessibility on all tables in the document
  document.querySelectorAll('table').forEach(checkTableAccessibility);

  // Return the announcer for use in the app
  return {
    announce: announcer.announce,
    setupKeyboardNavigation,
    trapFocus,
    createAnnouncer,
    prefersReducedMotion
  };
}

// Add the new 'transformInputData' function to the module exports
module.exports = {
  accessibilityUtils: accessibilityUtils,
  exportUtils: exportUtils,
  initAccessibility: initializeAccessibility,
  handleCredentialResponse: handleCredentialResponse,
  ensureElementId: ensureElementId,
  addAriaLabel: addAriaLabel,
  renderDependencyGraph: renderDependencyGraph,
  calculateSum: calculateSum,
  transformInputData: transformInputData,
  processData: processData,
  filterValidItems: filterValidItems
};