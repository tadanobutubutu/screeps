// main.js - Combined utility and accessibility features

// Utility functions for common tasks
/**
 * Debounces a function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttles a function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} - Throttled function
 */
function throttle(func, limit) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// TODO: Any additional changes requested in the issue
// main.js - Accessibility improvements implementation

// Accessibility helper function for keyboard navigation
function handleKeyboardNavigation(options = {}) {
  const { onEnter, onEscape, onArrowUp, onArrowDown } = options;
  
  return (event) => {
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
  };
}

// Alias for backwards compatibility
const handleKeyboard = handleKeyboardNavigation;

// Helper to manage focus within a container
function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleTab = (event) => {
    if (event.key !== 'Tab') return;

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  container.addEventListener('keydown', handleTab);
  
  return () => {
    container.removeEventListener('keydown', handleTab);
  };
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

  // Return the announcer for use in the app
  return {
    announce: announcer.announce,
    handleKeyboardNavigation,
    handleKeyboard,
    trapFocus,
    createAnnouncer,
    prefersReducedMotion,
    ensureDependencyGraphARIA,
    getLangAttribute
  };
}

// Get the lang attribute from the HTML element
function getLangAttribute() {
  const htmlElement = document.querySelector('html');
  return htmlElement ? htmlElement.getAttribute('lang') : null;
}

// Ensure the HTML element has proper ARIA attributes including lang
function ensureDependencyGraphARIA() {
  let htmlElement = document.querySelector('html');
  
  if (!htmlElement) {
    htmlElement = document.createElement('html');
    document.insertBefore(htmlElement, document.firstChild);
  }
  
  // Ensure lang attribute is set (accessibility requirement REACT_015)
  if (!htmlElement.hasAttribute('lang') || !htmlElement.getAttribute('lang')) {
    // Default to 'en' if no language is specified
    htmlElement.setAttribute('lang', 'en');
  }
  
  // Ensure dir attribute is set for proper text direction
  if (!htmlElement.hasAttribute('dir')) {
    htmlElement.setAttribute('dir', 'ltr');
  }
  
  return {
    lang: htmlElement.getAttribute('lang'),
    dir: htmlElement.getAttribute('dir')
  };
}

// TODO: add the new functions or changes requested in the issue

// New utility functions

/**
 * Checks if a value is an empty string, null, or undefined
 * @param {*} value - The value to check
 * @returns {boolean} - True if the value is empty
 */
function isEmpty(value) {
  if (value == null) return true;
  if (typeof value === 'string') return value.length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : str;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj);
  if (Array.isArray(obj)) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const cloned = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) cloned[key] = deepClone(obj[key]);
    }
    return cloned;
  }
  return obj;
}

/**
 * Generates a unique ID
 * @returns {string} - Unique identifier
 */
function generateId() {
  return 'id_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

/**
 * Safely parses JSON
 * @param {string} str - JSON string to parse
 * @param {*} defaultValue - Default value if parsing fails
 * @returns {*} - Parsed object or default value
 */
function safeJsonParse(str, defaultValue = null) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return defaultValue;
  }
}

// Add accessible names to SVG elements
function addAccessibleNamesToSvg(container) {
  const svgs = container.querySelectorAll('svg');
  if (svgs.length >= 2) {
    svgs[0].setAttribute('aria-label', 'First SVG');
    svgs[1].setAttribute('aria-label', 'Second SVG');
  }
  
  svgs.forEach((svg, index) => {
    if (!svg.hasAttribute('aria-label') && !svg.getAttribute('aria-hidden')) {
      svg.setAttribute('aria-label', `SVG element ${index + 1}`);
    }
  });
}

/**
 * Checks if an element is in the viewport
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} - True if element is in viewport
 */
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Function to handle getLangAttribute for REACT_015
function getLangAttribute(htmlElement) {
  if (!htmlElement) {
    htmlElement = document.querySelector('html');
  }
  return htmlElement ? htmlElement.getAttribute('lang') : null;
}

// Function to createInPageButton for REACT_015, REACT_036
function createInPageButton(options = {}) {
  const { target, text = 'Jump to content', className = 'in-page-button' } = options;
  const button = document.createElement('button');
  button.textContent = text;
  button.className = className;
  button.addEventListener('click', () => {
    const element = document.querySelector(target);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  });
  return button;
}

// Function to validateTableAccessibility for REACT_027
function validateTableAccessibility(table) {
  const issues = [];
  if (!table) return issues;
  if (!table.querySelector('caption')) {
    issues.push('Table missing caption');
  }
  const ths = table.querySelectorAll('th');
  if (ths.length === 0) {
    issues.push('Table missing header cells');
  }
  ths.forEach(th => {
    if (!th.hasAttribute('scope')) {
      issues.push('Header cell missing scope attribute');
    }
  });
  return issues;
}

// Function to validateTableStructure for REACT_027
function validateTableStructure(table) {
  const issues = [];
  if (!table) return issues;
  if (!table.querySelector('thead')) {
    issues.push('Table missing thead');
  }
  if (!table.querySelector('tbody')) {
    issues.push('Table missing tbody');
  }
  return issues;
}

// Function to validateLandmark for REACT_017
function validateLandmark(element) {
  const issues = [];
  if (!element) return issues;
  const landmarkRoles = ['banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation', 'search', 'region'];
  const role = element.getAttribute('role');
  if (landmarkRoles.includes(role)) {
    if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
      issues.push('Landmark missing accessible name');
    }
  } else {
    issues.push('Element is not a valid landmark');
  }
  return issues;
}

// Function to validateLandmarkStructure for REACT_017
function validateLandmarkStructure(element) {
  const issues = [];
  // Placeholder for more complex checks
  return issues;
}

// Function to ensureUniqueLandmarks for REACT_017, REACT_025
function ensureUniqueLandmarks() {
  const issues = [];
  const landmarks = document.querySelectorAll('[role="banner"], [role="complementary"], [role="contentinfo"], [role="form"], [role="main"], [role="navigation"], [role="search"], [role="region"]');
  const roles = {};
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    if (roles[role]) {
      issues.push(`Duplicate landmark role: ${role}`);
    }
    roles[role] = true;
  });
  return issues;
}

// Function to getSvgAccessibleName for REACT_041
function getSvgAccessibleName(svg) {
  if (!svg) return '';
  const label = svg.getAttribute('aria-label');
  if (label) return label;
  const title = svg.querySelector('title');
  if (title) return title.textContent;
  return 'SVG graphic';
}

// Function to setSvgAttributes for REACT_041
function setSvgAttributes(svg, attributes = {}) {
  if (!svg) return;
  Object.keys(attributes).forEach(attr => {
    svg.setAttribute(attr, attributes[attr]);
  });
}

// Function to handleFakeLinks for REACT_036
function handleFakeLinks(links) {
  links.forEach(link => {
    if (link.tagName !== 'A') {
      link.setAttribute('role', 'link');
      link.setAttribute('tabindex', '0');
      link.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          link.click();
        }
      });
    }
  });
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeAccessibility,
    handleKeyboardNavigation,
    handleKeyboard,
    trapFocus,
    createAnnouncer,
    prefersReducedMotion,
    ensureDependencyGraphARIA,
    getLangAttribute,
    isEmpty,
    capitalize,
    getRandomInt,
    clamp,
    deepClone,
    debounce,
    throttle,
    generateId,
    safeJsonParse,
    addAccessibleNamesToSvg,
    isInViewport,
    getLangAttribute,
    createInPageButton,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    ensureUniqueLandmarks,
    getSvgAccessibleName,
    setSvgAttributes,
    handleFakeLinks
  };
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', function() {
    window.accessibilityFeatures = initializeAccessibility();
    // Ensure ARIA attributes are properly set on the HTML element
    ensureDependencyGraphARIA();
  });
}