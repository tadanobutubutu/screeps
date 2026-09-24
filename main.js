// main.js - Main application entry point

// Add necessary new functions (without strict mode)

/**
 * Format a date to a readable string
 * @param {Date|number|string} date - The date to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted date string
 */
function formatDate(date, options = {}) {
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    return 'Invalid Date';
  }
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  };
  return d.toLocaleDateString('en-US', defaultOptions);
}

/**
 * Validate an email address
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
function isValidEmail(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Deep clone an object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item));
  }
  const cloned = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}

/**
 * Debounce a function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait = 250) {
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
 * Throttle a function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit = 250) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Check if an object is empty
 * @param {Object} obj - Object to check
 * @returns {boolean} True if object is empty
 */
function isEmptyObject(obj) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return false;
  }
  return Object.keys(obj).length === 0;
}

/**
 * Generate a random string
 * @param {number} length - Length of the string
 * @returns {string} Random string
 */
function generateRandomString(length = 10) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Main module

// TODO: This is the existing code that needs to be preserved
// ... existing imports ...

// Dependency imports
const http = require('http');
const url = require('url');
const { dependencyGraphContent } = require('./dependencyGraphContent');
const { indexContent } = require('./indexContent');

const main = require('./utilities');

const {
  add,
  subtract,
  multiply,
  divide,
  power,
  squareRoot,
  factorial,
  fibonacci,
  sum,
  average,
  max,
  min,
  mode,
  median,
} = require('./mathHelpers');

// Existing rendering functions (preserving existing exports and functions)

function greetingFunction() {
  return "Hello, World!";
}

// New function to address REACT_015: Add lang attribute to HTML element
function getLangAttribute() {
  return (typeof document !== 'undefined' && document.documentElement) ? document.documentElement.lang : 'en';
}

// New function to address REACT_015: Add lang attribute to HTML element
function detectAndSetLang(content) {
  let lang = 'en'; // Default to English

const a11yStore = {
  // ... existing methods ...

  /**
   * Check if the user prefers reduced motion
   * @returns {boolean} True if the user prefers reduced motion
   */
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  prefersHighContrast() {
    return window.matchMedia('(prefers-contrast: more)').matches;
  },

  updateLiveRegion(message, priority = 'polite') {
    if (!this.liveRegion) this.createLiveRegion();
    this.announce(message, priority);
  },

  checkLandmarkElements() {
    const landmarkElements = ['main', 'nav', 'header', 'footer', 'aside'];
    landmarkElements.forEach((element) => {
      const landmarks = document.querySelectorAll(`[role="${element}"]`);
      landmarks.forEach((landmark, index) => {
        if (landmark.id === '') {
          landmark.setAttribute('id', `${element}-${index}`);
        }

        if (landmarks.length > 1) {
          if (!landmark.hasAttribute('aria-label') && !landmark.hasAttribute('aria-labelledby')) {
            landmark.setAttribute('aria-label', `${element} ${index + 1}`);
          }
        }
      });
    });
  },

  addSVGAccessibilityProps() {
    const svgElements = document.querySelectorAll('svg');
    svgElements.forEach((svg) => {
      let titleElement = svg.querySelector('title');
      if (!titleElement) {
        titleElement = document.createElement('title');
        titleElement.textContent = 'Image';
        svg.insertBefore(titleElement, svg.firstChild);
      }

      if (!titleElement.id) {
        titleElement.id = `svg-title-${Math.floor(Math.random() * 10000)}`;
      }

      svg.setAttribute('aria-labelledby', titleElement.id);

      if (!svg.hasAttribute('role')) {
        svg.setAttribute('role', 'img');
      }
    });
  },

  fixFakeLinks() {
    const fakeLinks = document.querySelectorAll('[href]:not(a)');
    fakeLinks.forEach((link) => {
      link.setAttribute('role', 'link');
      link.setAttribute('tabindex', '0');
      link.setAttribute('data-interactive', 'true');
    });
  },

  /**
   * Ensure all form elements have proper labels
   */
  ensureFormAccessibility() {
    const formElements = document.querySelectorAll('input, textarea, select');
    formElements.forEach((element) => {
      if (!element.id) {
        element.id = `form-element-${Math.floor(Math.random() * 10000)}`;
      }

      if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
        const label = document.querySelector(`label[for="${element.id}"]`);
        if (!label) {
          element.setAttribute('aria-label', element.placeholder || 'Form input');
        }
      }
    });
  },

  /**
   * Ensure all interactive elements have proper keyboard support
   */
  ensureKeyboardNavigation() {
    const interactiveElements = document.querySelectorAll('[role="button"], [role="tab"], [role="menuitem"]');
    interactiveElements.forEach((element) => {
      if (!element.hasAttribute('tabindex')) {
        element.setAttribute('tabindex', '0');
      }

      if (!element.hasAttribute('aria-disabled')) {
        element.setAttribute('aria-disabled', 'false');
      }
    });
  },

  /**
   * Ensure all images have proper alternative text
   */
  ensureImageAccessibility() {
    const images = document.querySelectorAll('img');
    images.forEach((img) => {
      if (!img.alt && !img.getAttribute('aria-hidden')) {
        img.setAttribute('alt', '');
      }
    });
  },

  preserveExistingCode() {
    // TODO: This is the existing code that needs to be preserved
    // _Commit: 4b0a76170c9695891c503753fc8449a3a8434fd3_
    // <!-- todo-hash: 4db3fdb46f8c23568fe2832e296806312b7e888 -->
    // _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
    // <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
    // _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
    // <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
    // _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
    // <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->
  },

  newFunction() {
    // New function implementation from origin/main
  },

  /**
   * Ensure proper heading hierarchy in the document
   * @param {HTMLElement} container - The container to check
   */
  ensureProperHeadingHierarchy(container = document) {
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let currentLevel = 0;

    headings.forEach(heading => {
      const level = parseInt(heading.tagName.substring(1));
      if (level > currentLevel + 1) {
        // Skip a level - create intermediate heading
        const intermediateLevel = currentLevel + 1;
        const intermediateHeading = document.createElement(`h${intermediateLevel}`);
        intermediateHeading.textContent = 'Section';
        intermediateHeading.setAttribute('aria-hidden', 'true');
        heading.parentNode.insertBefore(intermediateHeading, heading);
        currentLevel = intermediateLevel;
      }
      currentLevel = level;
    });
  },

  /**
   * Check for proper contrast ratios in the document
   * @param {HTMLElement} container - The container to check
   * @returns {Array} Array of elements with insufficient contrast
   */
  checkContrastRatios(container = document) {
    const elements = container.querySelectorAll('*');
    const insufficientContrast = [];

    elements.forEach(element => {
      const style = window.getComputedStyle(element);
      const bgColor = style.backgroundColor;
      const color = style.color;

      if (bgColor && color && bgColor !== 'rgba(0, 0, 0, 0)') {
        const contrastRatio = this.calculateContrastRatio(color, bgColor);
        if (contrastRatio < 4.5) {
          insufficientContrast.push({
            element,
            contrastRatio,
            text: element.textContent.trim()
          });
        }
      }
    });

    return insufficientContrast;
  },

  /**
   * Calculate contrast ratio between two colors
   * @param {string} color1 - First color in rgb() or rgba() format
   * @param {string} color2 - Second color in rgb() or rgba() format
   * @returns {number} Contrast ratio
   */
  calculateContrastRatio(color1, color2) {
    const rgb1 = this.parseColor(color1);
    const rgb2 = this.parseColor(color2);

    const lum1 = this.calculateLuminance(rgb1);
    const lum2 = this.calculateLuminance(rgb2);

    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);

    return (lighter + 0.05) / (darker + 0.05);
  },

  /**
   * Parse color string to RGB components
   * @param {string} color - Color string in rgb() or rgba() format
   * @returns {Object} RGB components
   */
  parseColor(color) {
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
    if (!match) return { r: 0, g: 0, b: 0 };

    return {
      r: parseInt(match[1]) / 255,
      g: parseInt(match[2]) / 255,
      b: parseInt(match[3]) / 255
    };
  },

  /**
   * Calculate relative luminance of a color
   * @param {Object} rgb - RGB components
   * @returns {number} Relative luminance
   */
  calculateLuminance(rgb) {
    const components = ['r', 'g', 'b'].map(c => {
      const value = rgb[c];
      return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * components[0] + 0.7152 * components[1] + 0.0722 * components[2];
  },

  /**
   * Check for proper ARIA attributes on interactive elements
   * @param {HTMLElement} container - The container to check
   * @returns {Array} Array of elements with missing ARIA attributes
   */
  checkInteractiveElements(container = document) {
    const interactiveElements = container.querySelectorAll('button, [role="button"], [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const missingAria = [];

    interactiveElements.forEach(element => {
      if (!element.hasAttribute('aria-label') &&
          !element.hasAttribute('aria-labelledby') &&
          !element.hasAttribute('title') &&
          !element.textContent.trim()) {
        missingAria.push(element);
      }
    });

    return missingAria;
  },

  /**
   * Check for proper form labels
   * @param {HTMLElement} container - The container to check
   * @returns {Array} Array of form elements with missing labels
   */
  checkFormLabels(container = document) {
    const formElements = container.querySelectorAll('input:not([type="hidden"]), select, textarea');
    const missingLabels = [];

    formElements.forEach(element => {
      const id = element.id;
      if (id) {
        const label = container.querySelector(`label[for="${id}"]`);
        if (!label) {
          missingLabels.push(element);
        }
      } else {
        missingLabels.push(element);
      }
    });

    return missingLabels;
  },

  /**
   * Check for proper image alternatives
   * @param {HTMLElement} container - The container to check
   * @returns {Array} Array of images with missing alternatives
   */
  checkImageAlternatives(container = document) {
    const images = container.querySelectorAll('img, [role="img"]');
    const missingAlternatives = [];

    images.forEach(image => {
      if (!image.hasAttribute('alt') && !image.hasAttribute('aria-label') && !image.hasAttribute('aria-labelledby')) {
        missingAlternatives.push(image);
      }
    });

    return missingAlternatives;
  }
};

/**
 * Check if a link is accessible and properly structured
 * @param {HTMLAnchorElement} link - The link element to check
 * @returns {Object} Accessibility check result with status and issues
 */
function isLinkAccessible(link) {
  if (!link) {
    return {
      accessible: false,
      issues: ['Link element is required']
    };
  }

  const issues = [];

  // Check for href attribute
  const href = link.getAttribute('href');
  if (!href) {
    issues.push('Missing href attribute');
  } else if (href === '#' || href === '' || href === 'javascript:void(0)' || href === 'javascript:;') {
    issues.push('Link has no meaningful destination');
  }

  // Check for accessible text
  const accessibleName = link.textContent.trim();
  if (!accessibleName) {
    const ariaLabel = link.getAttribute('aria-label');
    const ariaLabelledby = link.getAttribute('aria-labelledby');
    if (!ariaLabel && !ariaLabelledby) {
      issues.push('Link has no accessible name');
    }
  }

  // Check for proper tabindex
  if (link.hasAttribute('tabindex') && link.getAttribute('tabindex') === '-1') {
    issues.push('Link is not keyboard accessible (tabindex=-1)');
  }

  // Check for visibility
  const style = window.getComputedStyle(link);
  if (style.display === 'none' || style.visibility === 'hidden') {
    issues.push('Link is hidden from screen readers');
  }

  // Check for proper role if not an anchor
  const tagName = link.tagName.toLowerCase();
  if (tagName !== 'a' && !link.hasAttribute('role')) {
    issues.push('Non-anchor element missing role="link"');
  }

  // Check for rel="noopener" on external links
  if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
    const rel = link.getAttribute('rel') || '';
    if (!rel.includes('noopener') && !rel.includes('noreferrer')) {
      issues.push('External link should have rel="noopener noreferrer" for security');
    }
  }

  return {
    accessible: issues.length === 0,
    issues: issues
  };
}

// ... rest of the code ...