// TODO: Address accessibility issues from insight report
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// Assuming main.js has a <html> tag, add the lang attribute based on your content
// For example, if the page is in English, set lang to 'en'

(function() {
  'use strict';

  // Add lang attribute to the html element for accessibility
  // This helps screen readers and other assistive technologies
  function setLanguageAttribute() {
    // Get the html element
    var htmlElement = document.documentElement;
    
    // Check if lang attribute is already set
    if (!htmlElement.hasAttribute('lang')) {
      // Set the language attribute (defaulting to 'en' for English)
      // This can be customized based on your content's actual language
      var language = document.documentElement.lang || 'en';
      htmlElement.setAttribute('lang', language);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setLanguageAttribute);
  } else {
    setLanguageAttribute();
  }
})();