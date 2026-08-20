// main.js
// [Existing code remains unchanged]

// Existing code that should be preserved

// Example of what the root element should look like in your HTML/JSX:
// <html lang="en">
// ... rest of the HTML content ...

/**
 * Returns the language attribute value for the document.
 * This helps address REACT_015 React Language Attribute accessibility check.
 * @param {string} [defaultLang='en'] - The default language code
 * @returns {string} The language code to use in the lang attribute
 */
function getDocumentLanguage(defaultLang = 'en') {
  // Check for language setting from various sources
  if (typeof navigator !== 'undefined' && navigator.language) {
    const browserLang = navigator.language.split('-')[0];
    if (browserLang && /^[a-z]{2}$/i.test(browserLang)) {
      return browserLang;
    }
  }
  return defaultLang;
}

/**
 * Validates that a given language code is valid according to BCP 47 standard.
 * This helps ensure the lang attribute is properly formatted for accessibility.
 * @param {string} lang - The language code to validate
 * @returns {boolean} True if valid, false otherwise
 */
function isValidLanguageCode(lang) {
  if (!lang || typeof lang !== 'string') {
    return false;
  }
  // Basic BCP 47 validation - language tag can be 2-3 letters, optionally followed by subtags
  const bcp47Pattern = /^[a-z]{2,3}(-[a-z0-9]{2,8})*$/i;
  return bcp47Pattern.test(lang);
}

module.exports = {
  // Your existing exports here
  // Example of adding a new function or change requested in the issue, if needed
  // newFunction: () => {
  //   // New function implementation
  // }
  getDocumentLanguage,
  isValidLanguageCode
};