// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())

// Export the functions for external use
export { getLangAttribute, createInPageButton };

/**
 * Gets the language attribute value from the HTML element
 * @returns {string} The language attribute value or 'en' as default
 */
function getLangAttribute() {
  const htmlElement = document.documentElement;
  const lang = htmlElement.getAttribute('lang');
  
  if (lang && lang.trim() !== '') {
    return lang.trim();
  }
  
  // Fallback to 'en' if lang attribute is missing or empty
  return 'en';
}

/**
 * Creates an in-page button element with proper accessibility attributes
 * @param {Object} options - Button options
 * @param {string} options.text - Button label text
 * @param {string} [options.id] - Optional button ID
 * @param {Function} [options.onClick] - Optional click handler
 * @returns {HTMLButtonElement} The created button element
 */
function createInPageButton(options = {}) {
  const { text = '', id, onClick } = options;
  
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = text;
  
  // Add lang attribute for accessibility
  button.lang = getLangAttribute();
  
  // Add ARIA attributes for better accessibility
  button.setAttribute('role', 'button');
  
  if (id) {
    button.id = id;
  }
  
  if (onClick && typeof onClick === 'function') {
    button.addEventListener('click', onClick);
  }
  
  return button;
}

// Main initialization function
function initialize() {
  console.log('Initialized with language:', getLangAttribute());
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
}