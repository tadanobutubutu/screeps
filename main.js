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

  // ... remaining a11yStore methods ...

  /**
   * Check if a link element is accessible
   * @param {HTMLElement|string} link - The link element or selector to check
   * @returns {boolean} True if the link is accessible
   */
  isLinkAccessible(link) {
    if (!link) return false;

    // If a string selector is provided, get the element
    const linkElement = typeof link === 'string' ? document.querySelector(link) : link;
    if (!linkElement) return false;

    // Check if it's an anchor tag or has role="link"
    const isLink = linkElement.tagName === 'A' || linkElement.getAttribute('role') === 'link';
    if (!isLink) return false;

    // Check if it has proper href
    const hasHref = linkElement.hasAttribute('href');
    const hrefValue = linkElement.getAttribute('href');

    // Check if link is focusable (naturally or via tabindex)
    const tabindex = linkElement.getAttribute('tabindex');
    const isFocusable = linkElement.tabIndex >= 0 || linkElement.tagName === 'A';

    // Check if link has text content or aria-label
    const hasLabel = linkElement.textContent.trim().length > 0 ||
                     linkElement.getAttribute('aria-label') ||
                     linkElement.getAttribute('aria-labelledby');

    // Link is accessible if it has href, is focusable, and has a label
    return hasHref && hrefValue.length > 0 && isFocusable && hasLabel;
  },

  /**
   * Get all links on the page and check their accessibility
   * @returns {Array} Array of objects with link info and accessibility status
   */
  getLinksAccessibilityReport() {
    const links = document.querySelectorAll('a, [role="link"]');
    const report = [];

    links.forEach((link, index) => {
      const isAccessible = this.isLinkAccessible(link);
      report.push({
        index,
        element: link,
        href: link.getAttribute('href'),
        text: link.textContent.trim().substring(0, 50),
        isAccessible,
        issues: []
      });

      if (!report[index].href || report[index].href.length === 0) {
        report[index].issues.push('Missing or empty href');
      }
      if (!report[index].text && !link.getAttribute('aria-label')) {
        report[index].issues.push('Missing text content and aria-label');
      }
    });

    return report;
  },
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