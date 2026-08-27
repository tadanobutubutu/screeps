// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - ADD_FOCUS: Make an HTML element focusable (NEW)

/**
 * Adds lang attribute to the HTML element for accessibility
 * @param {string} lang - The language code (e.g., 'en', 'es', 'fr')
 */
function addLangAttribute(lang = 'en') {
  const htmlElement = document.querySelector('html');
  if (htmlElement) {
    htmlElement.setAttribute('lang', lang);
  }
}

/**
 * Makes an HTML element focusable for accessibility
 * @param {string|Element} selector - CSS selector or DOM element
 * @param {Object} options - Focusable options
 * @returns {Element|null} - The focusable element or null
 */
function addFocus(selector, options = {}) {
  const element = typeof selector === 'string' 
    ? document.querySelector(selector) 
    : selector;
  
  if (!element) return null;
  
  // Add tabindex if not already focusable
  if (!element.hasAttribute('tabindex') && 
      !['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(element.tagName)) {
    const tabindex = options.tabindex !== undefined ? options.tabindex : 0;
    element.setAttribute('tabindex', tabindex);
  }
  
  // Add role if specified
  if (options.role) {
    element.setAttribute('role', options.role);
  }
  
  return element;
}

// Existing code preserved below
function initializeApp() {
  // Existing initialization code
  addLangAttribute('en');
}

function handleUserInteraction(element) {
  // Existing interaction handling
  addFocus(element, { tabindex: 0 });
}

// Export functions for use in other modules
export { addLangAttribute, addFocus, initializeApp, handleUserInteraction };

// Initialize on load
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initializeApp);
}