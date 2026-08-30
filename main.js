// TODO: Add back any required exports that might have been?

/**
 * Accessibility utilities for addressing insight report issues
 * REACT_015: Lang attribute support
 * REACT_025: Additional accessibility changes as per insight report
 */

// Helper to validate and sanitize language codes for lang attribute
const validateLangAttribute = (langCode) => {
  if (typeof langCode !== 'string') {
    return 'en';
  }
  // Basic validation for common language codes (ISO 639-1)
  const validLanguages = ['en', 'es', 'fr', 'de', 'it', 'pt', 'zh', 'ja', 'ko', 'ar', 'ru', 'hi'];
  const normalizedCode = langCode.toLowerCase().trim().substring(0, 2);
  return validLanguages.includes(normalizedCode) ? normalizedCode : 'en';
};

/**
 * Creates an accessibility-friendly element configuration
 * @param {Object} options - Element options
 * @param {string} options.lang - Language code for the element
 * @param {string} options.role - ARIA role
 * @returns {Object} Accessible element configuration
 */
const createAccessibleConfig = (options = {}) => {
  const lang = options.lang || 'en';
  return {
    lang: validateLangAttribute(lang),
    role: options.role || null,
    'aria-label': options['aria-label'] || null,
    'aria-describedby': options['aria-describedby'] || null,
    tabIndex: options.tabIndex !== undefined ? options.tabIndex : 0
  };
};

module.exports = {
  // Add back required exports here
  validateLangAttribute,
  createAccessibleConfig
};