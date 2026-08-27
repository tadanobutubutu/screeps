/**
 * Gets the language attribute from the document
 * @returns {string} The language attribute value or empty string if not set
 */
function getLangAttribute() {
  return document.documentElement.getAttribute('lang') || '';
}

/**
 * Gets the full language attribute from the document
 * @returns {string} The full language attribute value or the browser's language
 */
function getFullLangAttribute() {
  const lang = document.documentElement.getAttribute('lang');
  return lang || navigator.language || '';
}

// Example usage
console.log(getLangAttribute());
console.log(getFullLangAttribute());

module.exports = {
  getLangAttribute,
  getFullLangAttribute
};