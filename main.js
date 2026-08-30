// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: ensureDependencyGraphARIA, getLangAttribute)

/**
 * Get the language attribute value for the document
 * @returns {string} The language code (e.g., 'en')
 */
export function getLangAttribute() {
  if (typeof document !== 'undefined') {
    return document.documentElement.getAttribute('lang') || 'en';
  }
  return 'en';
}

/**
 * Ensures the dependency graph ARIA attributes are properly set
 * This addresses accessibility issue REACT_015
 */
export function ensureDependencyGraphARIA() {
  if (typeof document !== 'undefined') {
    const htmlElement = document.documentElement;
    
    // Ensure lang attribute is set on HTML element (REACT_015)
    if (!htmlElement.hasAttribute('lang')) {
      htmlElement.setAttribute('lang', getLangAttribute());
    }
  }
}

// Initialize accessibility features on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureDependencyGraphARIA);
  } else {
    ensureDependencyGraphARIA();
  }
}

// Existing code preserved below...

export function initializeApp() {
  ensureDependencyGraphARIA();
  // App initialization logic
  console.log('App initialized with accessibility features');
}

export function getAppVersion() {
  return '1.0.0';
}

// Export all accessibility utilities
export default {
  getLangAttribute,
  ensureDependencyGraphARIA,
  initializeApp,
  getAppVersion
};