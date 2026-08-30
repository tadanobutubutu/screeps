// Accessibility utilities

/**
 * Sets the lang attribute on an element with validation
 * REACT_015: Address lang attribute accessibility requirement
 * @param {HTMLElement} element - The target element
 * @param {string} lang - The language code (e.g., 'en', 'en-US')
 * @returns {boolean} - Returns true if successful, false otherwise
 */
const setLangAttribute = (element, lang) => {
  if (!element || typeof lang !== 'string') {
    return false;
  }
  
  // Validate lang attribute format (BCP 47 compliance)
  const validLangPattern = /^[a-z]{2,3}(-[A-Z]{2})?$/;
  if (!validLangPattern.test(lang)) {
    return false;
  }
  
  element.setAttribute('lang', lang);
  return true;
};

/**
 * Checks and returns accessibility attributes for an element
 * REACT_025: Add other accessibility changes as per the insight report
 * @param {HTMLElement} element - The target element
 * @returns {Object} - Object containing accessibility attribute values
 */
const checkAccessibilityAttributes = (element) => {
  const attributes = {};
  
  if (!element) {
    return attributes;
  }
  
  attributes.lang = element.getAttribute('lang');
  attributes.role = element.getAttribute('role');
  attributes.ariaLabel = element.getAttribute('aria-label');
  attributes.ariaDescribedby = element.getAttribute('aria-describedby');
  attributes.ariaHidden = element.getAttribute('aria-hidden');
  attributes.tabIndex = element.getAttribute('tabindex');
  
  return attributes;
};

/**
 * Ensures element has proper accessibility attributes
 * @param {HTMLElement} element - The target element
 * @param {Object} options - Accessibility options
 * @returns {boolean} - Returns true if all attributes were set successfully
 */
const ensureAccessibility = (element, options = {}) => {
  if (!element) {
    return false;
  }
  
  let success = true;
  
  if (options.lang) {
    success = setLangAttribute(element, options.lang) && success;
  }
  
  if (options.role) {
    element.setAttribute('role', options.role);
  }
  
  if (options.ariaLabel) {
    element.setAttribute('aria-label', options.ariaLabel);
  }
  
  return success;
};

// TODO: Add back any required exports that might have been?
module.exports = {
  setLangAttribute,
  checkAccessibilityAttributes,
  ensureAccessibility,
  // Add back required exports here
};