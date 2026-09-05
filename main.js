// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - [NEW] ADD YOUR CODE HERE if any other issues need to be addressed

/**
 * Adds lang attribute to the HTML element for accessibility compliance (REACT_015)
 * @param {Document} doc - The document object
 * @param {string} lang - The language code (default: 'en')
 * @returns {HTMLElement} The HTML element with lang attribute
 */
function addLangAttribute(doc, lang = 'en') {
  const html = doc.documentElement;
  if (!html.hasAttribute('lang')) {
    html.setAttribute('lang', lang);
  }
  return html;
}

// Initialize accessibility features when document is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    addLangAttribute(document);
  });
}

// Export for testing
module.exports = {
  addLangAttribute
};