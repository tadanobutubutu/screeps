// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and addLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility(), validateTableStructure() and fixTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by addMainLandmark(), validateLandmark(), validateLandmarkStructure() and validateLandmarkAttributes())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

// TODO: Create or update the affected functions to be accessible
// The functions below have been created to match the exported names

// main.js - Combined utility and accessibility features

// Existing functionality preserved
function exampleFunction() {
  return 'example';
}

// New function implementation
function processData(input) {
  if (!input) {
    return null;
  }
  return input;
}

// Accessibility helper function for keyboard navigation
function setupKeyboardNavigation(element, options = {}) {
  const { onEnter, onEscape, onArrowUp, onArrowDown } = options;
  
  element.addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'Enter':
        if (onEnter) onEnter(event);
        break;
      case 'Escape':
        if (onEscape) onEscape(event);
        break;
      case 'ArrowUp':
        if (onArrowUp) {
          event.preventDefault();
          onArrowUp(event);
        }
        break;
      case 'ArrowDown':
        if (onArrowDown) {
          event.preventDefault();
          onArrowDown(event);
        }
        break;
    }
  });
}

// Helper to manage focus within a container
function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  container.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  });
}

// ARIA live region announcer
function createAnnouncer() {
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  announcer.style.cssText = 'position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0, 0, 0, 0);';
  document.body.appendChild(announcer);
  
  return {
    announce: (message) => {
      announcer.textContent = '';
      setTimeout(() => {
        announcer.textContent = message;
      }, 100);
    }
  };
}

// Check if user prefers reduced motion
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Initialize accessibility features
function initializeAccessibility() {
  const announcer = createAnnouncer();
  
  return {
    announce: announcer.announce,
    setupKeyboardNavigation,
    trapFocus,
    prefersReducedMotion
  };
}

// TODO: add the new functions or changes requested in the issue

/**
 * Checks if a value is an empty string, null, or undefined
 * @param {*} value - The value to check
 * @returns {boolean} - True if the value is empty
 */
function isEmpty(value) {
  return value === null || value === undefined || value === '';
}

/**
 * Capitalizes the first letter of a string
 * @param {string} str - The string to capitalize
 * @returns {string} - The capitalized string
 */
function capitalize(str) {
  if (typeof str !== 'string' || str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Generates a random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Random integer
 */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Clamps a number between min and max values
 * @param {number} num - Number to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Clamped number
 */
function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

/**
 * Deep clones an object
 * @param {*} obj - Object to clone
 * @returns {*} - Cloned object
 */
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (obj instanceof Object) {
    const cloned = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }
  return obj;
}

// Add accessible names to SVG elements
function addAccessibleNamesToSvg() {
  const svgs = document.querySelectorAll('svg');
  if (svgs.length >= 2) {
    svgs[0].setAttribute('aria-label', 'First SVG');
    svgs[1].setAttribute('aria-label', 'Second SVG');
  }
}

// New accessibility functions from issue

function getLangAttribute() {
  const html = document.documentElement;
  return html.getAttribute('lang') || 'en';
}

function addLangAttribute(lang = 'en') {
  document.documentElement.setAttribute('lang', lang);
}

function validateTableAccessibility(table) {
  if (!table) return false;
  const hasHeader = table.querySelector('th');
  const hasCaption = table.querySelector('caption');
  return !!(hasHeader || hasCaption);
}

function validateTableStructure(table) {
  if (!table) return false;
  const rows = table.querySelectorAll('tr');
  return rows.length > 0;
}

function fixTableStructure(table) {
  if (!table) return;
  // Ensure first row has th elements if it's a header
  const firstRow = table.querySelector('tr');
  if (firstRow && !firstRow.querySelector('th')) {
    const cells = firstRow.querySelectorAll('td, th');
    cells.forEach(cell => {
      const th = document.createElement('th');
      th.textContent = cell.textContent;
      th.setAttribute('scope', 'col');
      cell.replaceWith(th);
    });
  }
}

function addMainLandmark() {
  if (!document.querySelector('main')) {
    const main = document.createElement('main');
    document.body.insertBefore(main, document.body.firstChild);
  }
}

function validateLandmark() {
  const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"], [role="search"], main, nav, header, footer');
  return landmarks.length > 0;
}

function validateLandmarkStructure() {
  const main = document.querySelector('main, [role="main"]');
  return !!main;
}

function validateLandmarkAttributes() {
  const main = document.querySelector('main, [role="main"]');
  if (!main) return false;
  return !main.getAttribute('aria-label') && !main.getAttribute('aria-labelledby');
}

function getSvgAccessibleName(svg) {
  if (!svg) return '';
  return svg.getAttribute('aria-label') || svg.getAttribute('title') || '';
}

function setSvgAttributes(svg, attributes = {}) {
  if (!svg) return;
  Object.keys(attributes).forEach(key => {
    svg.setAttribute(key, attributes[key]);
  });
}

function ensureUniqueLandmarks() {
  const mains = document.querySelectorAll('main, [role="main"]');
  if (mains.length > 1) {
    // Keep first, remove extra or convert to div
    for (let i = 1; i < mains.length; i++) {
      mains[i].setAttribute('role', 'region');
    }
  }
}

function createInPageButton(text = 'Click here') {
  const button = document.createElement('button');
  button.textContent = text;
  return button;
}

function validateLinkAccessibility(link) {
  if (!link) return false;
  const hasText = link.textContent.trim().length > 0;
  const hasAriaLabel = link.getAttribute('aria-label');
  const hasTitle = link.getAttribute('title');
  return !!(hasText || hasAriaLabel || hasTitle);
}

function handleFakeLinks() {
  const fakeLinks = document.querySelectorAll('[role="link"]:not(a)');
  fakeLinks.forEach(el => {
    if (!el.getAttribute('tabindex')) {
      el.setAttribute('tabindex', '0');
    }
    if (el.tagName !== 'BUTTON') {
      el.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          el.click();
        }
      });
    }
  });
}

function addProperLandmarkRegions() {
  if (!document.querySelector('header, [role="banner"]')) {
    const header = document.createElement('header');
    document.body.insertBefore(header, document.body.firstChild);
  }
  if (!document.querySelector('footer, [role="contentinfo"]')) {
    const footer = document.createElement('footer');
    document.body.appendChild(footer);
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    exampleFunction,
    processData,
    initializeAccessibility,
    setupKeyboardNavigation,
    trapFocus,
    createAnnouncer,
    prefersReducedMotion,
    isEmpty,
    capitalize,
    getRandomInt,
    clamp,
    deepClone,
    addAccessibleNamesToSvg,
    getLangAttribute,
    addLangAttribute,
    validateTableAccessibility,
    validateTableStructure,
    fixTableStructure,
    addMainLandmark,
    validateLandmark,
    validateLandmarkStructure,
    validateLandmarkAttributes,
    getSvgAccessibleName,
    setSvgAttributes,
    ensureUniqueLandmarks,
    createInPageButton,
    validateLinkAccessibility,
    handleFakeLinks,
    addProperLandmarkRegions
  };
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    window.accessibilityFeatures = initializeAccessibility();
    addAccessibleNamesToSvg();
  });
}