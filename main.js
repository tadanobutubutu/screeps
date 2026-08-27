// main.js

/**
 * Gets the language attribute from the document's root element
 * @returns {string|null} The language attribute value or null if not set
 */
function getLangAttribute() {
  return document.documentElement.getAttribute('lang');
}

// Export for testing and external use
module.exports = {
  getLangAttribute
};