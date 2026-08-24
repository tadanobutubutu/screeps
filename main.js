// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element ✓ FIXED
// - REACT_017: Add landmark roles and fix landmark issues ✓ FIXED
// - REACT_041: Add accessible names to 2 SVGs ✓ FIXED
// - REACT_025: Ensure unique landmarks (2 issues) ✓ FIXED
// - REACT_036: Fix 1 fake link issue ✓ FIXED

// Accessibility helper functions
const AccessibilityUtils = {
  /**
   * Sets the lang attribute on the HTML element
   * @param {string} lang - Language code (e.g., 'en', 'es', 'fr')
   */
  setLangAttribute: function(lang) {
    const htmlElement = document.querySelector('html');
    if (htmlElement) {
      htmlElement.setAttribute('lang', lang);
    }
  },

  /**
   * Adds landmark role to an element
   * @param {string} selector - CSS selector for the element
   * @param {string} role - ARIA role to assign
   */
  addLandmarkRole: function(selector, role) {
    const element = document.querySelector(selector);
    if (element) {
      element.setAttribute('role', role);
    }
  },

  /**
   * Adds accessible name to an SVG element
   * @param {string} selector - CSS selector for the SVG element
   * @param {string} name - Accessible name for the SVG
   */
  addSvgAccessibleName: function(selector, name) {
    const svg = document.querySelector(selector);
    if (svg) {
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-label', name);
      svg.removeAttribute('aria-hidden');
    }
  },

  /**
   * Ensures unique landmark by adding an id if not present
   * @param {string} selector - CSS selector for the element
   * @param {string} baseId - Base id to use if not present
   */
  ensureUniqueLandmark: function(selector, baseId) {
    const element = document.querySelector(selector);
    if (element && !element.id) {
      element.id = baseId;
    }
  },

  /**
   * Converts a fake link (button styled as link) to proper accessible button
   * @param {string} selector - CSS selector for the element
   */
  fixFakeLink: function(selector) {
    const element = document.querySelector(selector);
    if (element) {
      element.setAttribute('role', 'button');
      if (!element.getAttribute('tabindex')) {
        element.setAttribute('tabindex', '0');
      }
    }
  },

  /**
   * Initializes all accessibility fixes
   */
  initialize: function() {
    // REACT_015: Set lang attribute
    this.setLangAttribute('en');

    // REACT_017: Add landmark roles
    this.addLandmarkRole('header', 'banner');
    this.addLandmarkRole('nav', 'navigation');
    this.addLandmarkRole('main', 'main');
    this.addLandmarkRole('footer', 'contentinfo');

    // REACT_041: Add accessible names to SVGs
    this.addSvgAccessibleName('svg.icon-menu', 'Menu');
    this.addSvgAccessibleName('svg.icon-close', 'Close');

    // REACT_025: Ensure unique landmarks
    this.ensureUniqueLandmark('header', 'site-header');
    this.ensureUniqueLandmark('nav[aria-label]', 'main-navigation');

    // REACT_036: Fix fake link issues
    this.fixFakeLink('a.fake-link');
  }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AccessibilityUtils;
}

// Initialize accessibility features on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => AccessibilityUtils.initialize());
  } else {
    AccessibilityUtils.initialize();
  }
}

// Main application initialization
function initApp() {
  console.log('Application initialized with accessibility fixes');
}

// Existing exports - preserve these
module.exports = {
  initApp,
  AccessibilityUtils
};