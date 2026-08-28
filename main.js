// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - [NEW] ADD YOUR CODE HERE if any other issues need to be addressed

// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)

/**
 * Gets the accessible name for an SVG element.
 * @param {SVGElement} svgElement - The SVG element to get the accessible name for
 * @returns {string|null} The accessible name or null if not found
 */
function getSvgAccessibleName(svgElement) {
  if (!svgElement) return null;

  const title = svgElement.querySelector('title');
  if (title && title.textContent) {
    return title.textContent.trim();
  }

  if (svgElement.hasAttribute('aria-label')) {
    return svgElement.getAttribute('aria-label');
  }

  const labelledBy = svgElement.getAttribute('aria-labelledby');
  if (labelledBy) {
    const label = document.getElementById(labelledBy);
    if (label) {
      return label.textContent.trim();
    }
  }

  return null;
}

/**
 * Adds a lang attribute to the HTML element
 * @param {string} [lang='en'] - The language value to set
 */
function addLangAttribute(lang = 'en') {
  const htmlElement = document.documentElement;
  if (!htmlElement) return;

  // Add the lang attribute if not already present
  if (!htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', lang);
  }
}

/**
 * Validates table accessibility
 * @param {HTMLTableElement} table - The table element to validate
 * @returns {Object} - Validation result with issues array
 */
function validateTableAccessibility(table) {
  const issues = [];

  if (!table) return { valid: false, issues: ['Table not found'] };

  // Check for caption
  const caption = table.querySelector('caption');
  if (!caption) {
    issues.push('Table is missing a caption');
  }

  return { valid: issues.length === 0, issues };
}

// Address accessibility issues from insight report:

module.exports = {
  addProperLandmarkRegions: () => ({
    // Your implementation here
  }),
  addLangAttribute,
  validateTableAccessibility,
  getSvgAccessibleName,
  // ... other existing exports ...
};

// Utility functions (added from the new changes)
function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

function debounce(func, wait) {
  let timeout;
  return function(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function generateId() {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    addLangAttribute,
    validateTableAccessibility,
    getSvgAccessibleName,
    formatDate,
    debounce,
    generateId
  };
}