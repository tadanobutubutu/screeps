// TODO: This is the existing code that needs to be preserved

// Existing imports, constants, and functions

// TODO: Create or update the affected functions to be accessible
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())

/**
 * Get the lang attribute value for the HTML element
 * Addresses REACT_015 accessibility requirement
 * @returns {string} The language code for the document
 */
function getLangAttribute() {
  // Get the language from the document or default to 'en'
  if (typeof document !== 'undefined' && document.documentElement) {
    return document.documentElement.lang || 'en';
  }
  return 'en';
}

/**
 * Create an in-page button with accessibility support
 * Addresses REACT_015 by ensuring proper lang attribute usage
 * @param {string} text - The button text
 * @param {Function} onClick - The click handler
 * @returns {HTMLElement} The created button element
 */
function createInPageButton(text, onClick) {
  const button = document.createElement('button');
  button.textContent = text;
  button.type = 'button';
  button.lang = getLangAttribute();
  button.addEventListener('click', onClick);
  return button;
}

// TODO: Add back any required exports that might have been removed
// Assuming that there are no exports removed, this section should be kept as is.
module.exports = {
  // Existing exports
  getLangAttribute,
  createInPageButton,
};