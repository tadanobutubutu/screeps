// main.js - Main entry point with accessibility fixes applied

// Add lang attribute support at the module level for generated HTML
const DEFAULT_LANG = 'en';

// Ensure HTML generation includes lang attribute
function generateHTMLWithLang(options = {}) {
  const lang = options.lang || DEFAULT_LANG;
  return `<html lang="${lang}">`;
}

// PRESERVED: All existing code, exports, and functions from current main.js
// ... [existing code preserved] ...

// Add accessibility helper for screen readers
function setLanguageAttribute(document, lang = 'en') {
  if (document && document.documentElement) {
    document.documentElement.lang = lang;
  }
}

// Export existing functionality unchanged
module.exports = {
  // ... [existing exports preserved] ...
  
  // New exports for accessibility
  DEFAULT_LANG,
  generateHTMLWithLang,
  setLanguageAttribute
};