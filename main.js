// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - ADD_FOCUS: Make an HTML element focusable (NEW)

/**
 * Adds the lang attribute to the HTML element for accessibility
 * @param {string} langCode - The language code (e.g., 'en', 'es', 'fr')
 * @returns {void}
 */
function addLangAttribute(langCode = 'en') {
  const htmlElement = document.querySelector('html');
  if (htmlElement) {
    htmlElement.setAttribute('lang', langCode);
  }
}

/**
 * Makes an HTML element focusable for accessibility
 * @param {HTMLElement} element - The element to make focusable
 * @param {boolean} isFocusable - Whether the element should be focusable
 * @returns {void}
 */
function makeFocusable(element, isFocusable = true) {
  if (!element) return;
  
  if (isFocusable) {
    element.setAttribute('tabindex', '0');
    element.removeAttribute('disabled');
  } else {
    element.setAttribute('tabindex', '-1');
  }
}

// Initialize accessibility features on page load
document.addEventListener('DOMContentLoaded', () => {
  addLangAttribute();
  
  // Make any elements with data-focusable attribute focusable
  const focusableElements = document.querySelectorAll('[data-focusable]');
  focusableElements.forEach(el => {
    makeFocusable(el, true);
  });
});

// Export functions for testing
module.exports = {
  addLangAttribute,
  makeFocusable
};