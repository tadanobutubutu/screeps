// TODO: Address accessibility issues from insight report
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// Assuming main.js has a <html> tag, add the lang attribute based on your content
// For example, if the page is in English, set lang to 'en'

(function() {
  'use strict';

  /**
   * Sets the language attribute on the HTML element for accessibility
   * @param {string} langCode - The language code (e.g., 'en', 'es', 'fr')
   */
  function setLanguageAttribute(langCode) {
    var htmlElement = document.documentElement;
    if (htmlElement && langCode) {
      htmlElement.setAttribute('lang', langCode);
    }
  }

  // Default to English for accessibility compliance
  setLanguageAttribute('en');

  // Export for testing and external use
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { setLanguageAttribute: setLanguageAttribute };
  }

  // Expose globally if needed
  if (typeof window !== 'undefined') {
    window.setLanguageAttribute = setLanguageAttribute;
  }
})();