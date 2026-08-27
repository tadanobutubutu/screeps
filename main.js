// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - ADD_FOCUS: Make an HTML element focusable (NEW)

/**
 * Adds lang attribute to the HTML element for accessibility
 * @param {string} langValue - The language value (e.g., 'en', 'es')
 */
function addLangAttribute(langValue = 'en') {
  const htmlElement = document.querySelector('html');
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', langValue);
  }
}

/**
 * Makes an HTML element focusable by adding tabindex attribute
 * @param {string} selector - CSS selector for the element
 * @param {number} tabindexValue - The tabindex value (default: 0)
 */
function addFocusAttribute(selector, tabindexValue = 0) {
  const element = document.querySelector(selector);
  if (element && !element.hasAttribute('tabindex')) {
    element.setAttribute('tabindex', tabindexValue);
  }
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', () => {
  addLangAttribute('en');
});