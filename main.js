// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// Fix language for the HTML root element

(function() {
  'use strict';

  // Get or set the language attribute on the HTML element
  function getDocumentLanguage() {
    return document.documentElement.lang || 'en';
  }

  function setDocumentLanguage(lang) {
    if (lang && typeof lang === 'string' && lang.length > 0) {
      document.documentElement.lang = lang;
    }
  }

  // Initialize language from meta tag or default to 'en'
  function initializeLanguage() {
    const metaLang = document.querySelector('meta[name="language"]');
    if (metaLang && metaLang.content) {
      setDocumentLanguage(metaLang.content);
    } else if (!document.documentElement.lang) {
      setDocumentLanguage('en');
    }
  }

  // Run initialization when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLanguage);
  } else {
    initializeLanguage();
  }

  // Export functions for testing
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      getDocumentLanguage,
      setDocumentLanguage,
      initializeLanguage
    };
  }
})();