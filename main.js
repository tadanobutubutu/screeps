// Main module exports
// This file exports various utility functions and helpers

// TODO: Add any other missing exports that might have been?

/**
 * Format a date string
 * @param {Date|string} date - The date to format
 * @param {string} format - The format string
 * @returns {string} - Formatted date string
 */
export function formatDate(date, format = 'YYYY-MM-DD') {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day);
}

/**
 * Debounce a function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export function debounce(func, wait = 300) {
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
 * @returns {Function} - Throttled function
 */
export function throttle(func, limit = 300) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Deep clone an object
 * @param {*} obj - Object to clone
 * @returns {*} - Cloned object
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item));
  }
  
  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}

/**
 * Capitalize first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string} - Capitalized string
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Generate a random string
 * @param {number} length - Length of the string
 * @returns {string} - Random string
 */
export function randomString(length = 10) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Group array items by a key
 * @param {Array} array - Array to group
 * @param {string} key - Key to group by
 * @returns {Object} - Grouped object
 */
export function groupBy(array, key) {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
}

/**
 * Sleep for a specified duration
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} - Promise that resolves after the delay
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if value is empty (null, undefined, empty string, empty array, empty object)
 * @param {*} value - Value to check
 * @returns {boolean} - True if empty
 */
export function isEmpty(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Merge multiple objects deeply
 * @param {...Object} objects - Objects to merge
 * @returns {Object} - Merged object
 */
export function deepMerge(...objects) {
  return objects.reduce((result, obj) => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (
          typeof obj[key] === 'object' &&
          obj[key] !== null &&
          !Array.isArray(obj[key])
        ) {
          result[key] = deepMerge(result[key] || {}, obj[key]);
        } else {
          result[key] = obj[key];
        }
      }
    }
    return result;
  }, {});
}

// Assuming this is a part of main.js where HTML content is being used

// Corrected HTML snippet with lang attribute added
// <!DOCTYPE html>
// <html lang="en">
// <head>
//   ...
// </head>
// <body>
//   ...
// </body>
// </html>

/**
 * Add role="banner" to header element
 * @param {HTMLElement} headerElement - The header element
 */
export function addRoleToHeader(headerElement) {
  if (headerElement) {
    headerElement.setAttribute('role', 'banner');
  }
}

/**
 * Add role="main" to main element
 * @param {HTMLElement} mainElement - The main element
 */
export function addRoleToMain(mainElement) {
  if (mainElement) {
    mainElement.setAttribute('role', 'main');
  }
}

/**
 * Add role="contentinfo" to footer element
 * @param {HTMLElement} footerElement - The footer element
 */
export function addRoleToFooter(footerElement) {
  if (footerElement) {
    footerElement.setAttribute('role', 'contentinfo');
  }
}

/**
 * Add role="navigation" to nav element
 * @param {HTMLElement} navElement - The nav element
 */
export function addRoleToNav(navElement) {
  if (navElement) {
    navElement.setAttribute('role', 'navigation');
  }
}

// REACT_037: Add proper landmark regions
export function addProperLandmarkRegions() {
  const header = document.querySelector('header') || document.getElementById('header');
  const nav = document.querySelector('nav') || document.getElementById('nav');
  const main = document.querySelector('main') || document.getElementById('main');
  const footer = document.querySelector('footer') || document.getElementById('footer');

  if (header && !header.getAttribute('role')) {
    header.setAttribute('role', 'banner');
  }
  if (nav && !nav.getAttribute('role')) {
    nav.setAttribute('role', 'navigation');
  }
  if (main && !main.getAttribute('role')) {
    main.setAttribute('role', 'main');
  }
  if (footer && !footer.getAttribute('role')) {
    footer.setAttribute('role', 'contentinfo');
  }
}

// Assuming you have access to your elements like this:
const nav = document.getElementById('nav');
const header = document.getElementById('header');
const main = document.getElementById('main');
const footer = document.getElementById('footer');

addRoleToNav(nav);
addRoleToHeader(header);
addRoleToMain(main);
addRoleToFooter(footer);

addProperLandmarkRegions();

// Don't forget to include Jest test cases to ensure the new landmark roles are added correctly.

// Constants
export const VERSION = '1.0.0';
export const API_BASE_URL = '/api/v1';
export const MAX_RETRIES = 3;
export const DEFAULT_TIMEOUT = 5000;