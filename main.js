/**
 * Main Application Entry Point
 */

// Set the language attribute on the document
document.documentElement.lang = 'en';

/**
 * Get the current language of the document
 * @returns {string} The language code
 */
export function getLanguage() {
  return document.documentElement.lang || 'en';
}

/**
 * Set the language of the document
 * @param {string} lang - The language code to set
 */
export function setLanguage(lang) {
  document.documentElement.lang = lang;
}

/**
 * Initialize the application
 */
export function initialize() {
  console.log('Application initialized');
  console.log(`Document language: ${getLanguage()}`);
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
}

export default {
  getLanguage,
  setLanguage,
  initialize
};