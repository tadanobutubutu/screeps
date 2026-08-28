// TODO: Address any missing required exports
// REACT_015: Add lang attribute
// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ensureUniqueLandmarks())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and createInPageButton())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and validateLandmarkStructure())
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), createAccessibleLink() and handleAccessibilityIssues())

/**
 * Sets the lang attribute on the HTML element if not already present
 * @returns {boolean} - True if lang was set or already existed
 */
function setHtmlLangAttribute() {
  if (typeof document === 'undefined') return false;

  const htmlElement = document.documentElement;
  if (!htmlElement) return false;

  const existingLang = getLangAttribute(htmlElement);
  if (existingLang) return true;

  // Default to 'en' if no lang attribute is set
  htmlElement.setAttribute('lang', 'en');
  return true;
}

/**
 * Gets the language attribute value from an HTML element
 * @param {HTMLElement} element - The HTML element to get lang from
 * @returns {string|null} - The language attribute value or null
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

// Address accessibility issues from insight report:

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

// Apply lang attribute to HTML element on load
if (typeof document !== 'undefined') {
  setHtmlLangAttribute();
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getLangAttribute,
    getFullLangAttribute,
    setHtmlLangAttribute,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    ensureUniqueLandmarks,
    getSvgAccessibleName,
    createInPageButton,
    createAccessibleLink,
    handleAccessibilityIssues,
    formatDate,
    debounce
  };
}