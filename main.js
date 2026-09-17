// TODO: Address accessibility issues from insight report — FIXED
// REACT_015: Add lang attribute

// Accessibility issues addressed per insight report

(function() {
  'use strict';

  // Ensure the document has a lang attribute for accessibility
  if (document.documentElement && !document.documentElement.hasAttribute('lang')) {
    document.documentElement.setAttribute('lang', 'en');
  }
})();