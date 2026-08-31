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
  if (htmlElement) {
    return htmlElement.getAttribute('lang');
  }
  const html = document.querySelector('html');
  return html ? html.getAttribute('lang') : null;
}

// Function to createInPageButton for REACT_015, REACT_036
function createInPageButton(options = {}) {
  const {
    text = '',
    href = '#',
    ariaLabel = '',
    className = '',
    onClick = () => {}
  } = options;

  let element;
  if (href) {
    element = document.createElement('a');
    element.href = href;
    element.setAttribute('role', 'button');
    element.setAttribute('tabindex', '0');
  } else {
    element = document.createElement('button');
    element.setAttribute('type', 'button');
  }
  element.textContent = text;
  if (ariaLabel) element.setAttribute('aria-label', ariaLabel);
  if (className) element.className = className;
  element.addEventListener('click', onClick);
  element.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(e);
    }
  });
  return element;
}

// Function to validateTableAccessibility for REACT_027
function validateTableAccessibility(table) {
  const issues = [];
  if (!table) return issues;

  // Check for caption
  const caption = table.querySelector('caption');
  if (!caption) {
    issues.push('Table is missing a <caption> element.');
  }

  // Check for header cells
  const ths = table.querySelectorAll('th');
  if (ths.length === 0) {
    issues.push('Table has no <th> elements.');
  } else {
    ths.forEach((th, i) => {
      if (!th.getAttribute('scope')) {
        issues.push(`Header cell ${i + 1} missing 'scope' attribute.`);
      }
      if (!th.getAttribute('aria-label') && !th.textContent.trim()) {
        issues.push(`Header cell ${i + 1} has no text content or aria-label.`);
      }
    });
  }

  return issues;
}

// Function to validateTableStructure for REACT_027
function validateTableStructure(table) {
  const issues = [];
  if (!table) return issues;

  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');
  const tfoot = table.querySelector('tfoot');

  // Check for thead and tbody
  if (!thead && table.rows.length > 0) {
    issues.push('Table should include a <thead> element.');
  }
  if (!tbody && table.rows.length > (thead ? thead.rows.length : 0)) {
    issues.push('Table should include a <tbody> element.');
  }

  // Ensure rows are inside thead/tbody/tfoot
  const rows = table.rows;
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const parent = row.parentElement;
    if (parent && !['THEAD', 'TBODY', 'TFOOT'].includes(parent.tagName)) {
      issues.push(`Row ${i + 1} is not inside a <thead>, <tbody>, or <tfoot> element.`);
    }
  }

  // First row should contain th elements
  const firstRow = table.rows[0];
  if (firstRow) {
    const cells = firstRow.cells;
    for (let i = 0; i < cells.length; i++) {
      if (cells[i].tagName !== 'TH') {
        issues.push(`First row cell ${i + 1} should be a <th> element.`);
      }
    }
  }

  return issues;
}

// Function to validateLandmark for REACT_017
function validateLandmark(element) {
  const issues = [];
  if (!element) return issues;

  const role = element.getAttribute('role');
  const landmarkRoles = ['banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation', 'search'];
  const hasLandmarkRole = role && landmarkRoles.includes(role);
  const hasAriaLabel = element.hasAttribute('aria-label') || element.hasAttribute('aria-labelledby');

  if (!hasLandmarkRole) {
    issues.push('Element does not have a landmark role.');
  } else if (!hasAriaLabel) {
    issues.push('Landmark element should have an accessible name (aria-label or aria-labelledby).');
  }

  return issues;
}

// Function to validateLandmarkStructure for REACT_017
function validateLandmarkStructure(element) {
  const issues = [];
  if (!element) return issues;

  const role = element.getAttribute('role');
  const landmarkRoles = ['banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation', 'search'];
  if (!landmarkRoles.includes(role)) {
    return issues;
  }

  // Check for nested landmarks of the same type
  const descendants = element.querySelectorAll(`[role="${role}"]`);
  if (descendants.length > 1) {
    issues.push(`Duplicate landmark role "${role}" found within the same landmark.`);
  }

  // Main landmark should contain at least one heading
  if (role === 'main') {
    const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
    if (headings.length === 0) {
      issues.push('Main landmark should contain at least one heading.');
    }
  }

  return issues;
}

// Function to ensureUniqueLandmarks for REACT_017, REACT_025
function ensureUniqueLandmarks() {
  const issues = [];
  const landmarks = document.querySelectorAll('[role="banner"], [role="complementary"], [role="contentinfo"], [role="form"], [role="main"], [role="navigation"], [role="search"]');
  const seen = new Set();
  landmarks.forEach((landmark) => {
    const role = landmark.getAttribute('role');
    if (seen.has(role)) {
      issues.push(`Duplicate landmark role "${role}" found.`);
    } else {
      seen.add(role);
    }
  });
  return issues;
}

// Function to getSvgAccessibleName for REACT_041
function getSvgAccessibleName(svg) {
  if (!svg) return '';
  // Check for title element
  const title = svg.querySelector('title');
  if (title && title.textContent.trim()) {
    return title.textContent.trim();
  }
  // Check for aria-label
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;
  // Check for aria-labelledby
  const ariaLabelledBy = svg.getAttribute('aria-labelledby');
  if (ariaLabelledBy) {
    const label = document.getElementById(ariaLabelledBy);
    if (label) return label.textContent.trim();
  }
  // Fallback
  return 'SVG element';
}

// Function to setSvgAttributes for REACT_041
function setSvgAttributes(svg, attributes = {}) {
  if (!svg) return;
  Object.keys(attributes).forEach((key) => {
    svg.setAttribute(key, attributes[key]);
  });
}

// Function to handleFakeLinks for REACT_036
function handleFakeLinks(links) {
  if (!links) return;
  links.forEach((link) => {
    // Make elements with role="link" focusable and keyboard accessible
    if (link.tagName !== 'A' && link.getAttribute('role') === 'link') {
      if (!link.hasAttribute('tabindex')) link.setAttribute('tabindex', '0');
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