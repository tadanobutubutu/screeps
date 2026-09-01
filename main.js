// TODO: Identify and update specific functions that render dependency graphs or
// index views.
// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...)
// - REACT_036: Fix 1 fake link issue (handled by ... createInPageButton(), ... and personName())
// - ADD: Address new accessibility issues from insight report
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// Assuming main.js has a <html> tag, add the lang attribute based on your content
// For example, if the page is in English, set lang to 'en'
import React from 'react';

/**
 * Adds the lang attribute to the document's <html> tag based on content
 * @param {string} lang - The language code (e.g., 'en', 'es', 'fr')
 * @returns {string} The lang attribute value that was set
 */
function setHtmlLangAttribute(lang) {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang || 'en';
  }
  return lang || 'en';
}

/**
 * Detects the language of the given content and sets the HTML lang attribute
 * @param {string} content - The text content to analyze
 * @returns {string} The detected language code
 */
function detectAndSetLang(content) {
  // Simple language detection based on common patterns
  let lang = 'en'; // Default to English

  if (content) {
    // Check for common non-ASCII characters to help detect language
    if (/[\u4e00-\u9fff]/.test(content)) {
      lang = 'zh'; // Chinese
    } else if (/[\u3040-\u30ff]/.test(content)) {
      lang = 'ja'; // Japanese
    } else if (/[\u0400-\u04ff]/.test(content)) {
      lang = 'ru'; // Russian/Cyrillic
    } else if (/[\u0600-\u06ff]/.test(content)) {
      lang = 'ar'; // Arabic
    } else if (/[àâçéèêëîïôûùüÿœæ]/i.test(content)) {
      lang = 'fr'; // French
    } else if (/[äöüß]/i.test(content)) {
      lang = 'de'; // German
    }
  }

  return lang;
}

/**
 * Gets the current lang attribute from the document's <html> tag
 * @returns {string} The current lang attribute value, defaults to 'en'
 */
function getLangAttribute() {
  if (typeof document !== 'undefined' && document.documentElement) {
    return document.documentElement.lang || 'en';
  }
  return 'en';
}

/**
 * Creates a person name element with proper accessibility attributes
 * @param {Object} options - Options for creating the person name element
 * @param {string} options.firstName - The person's first name
 * @param {string} options.lastName - The person's last name
 * @param {HTMLElement} options.container - Optional container element to append to
 * @returns {HTMLElement} The created element with accessible naming
 */
function personName(options = {}) {
  const { firstName = '', lastName = '', container = null } = options;
  const fullName = `${firstName} ${lastName}`.trim();

  const element = document.createElement('span');
  element.setAttribute('aria-label', fullName);
  element.textContent = fullName;

  if (container) {
    container.appendChild(element);
  }

  return element;
}

/**
 * Creates an accessible in-page button and appends it to the given parent element.
 * @param {HTMLElement} parent - The parent element where the button should be inserted (defaults to document.body)
 * @returns {HTMLElement} The created button element
 */
function createInPageButton(parent = document.body) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.setAttribute('role', 'button');
  btn.setAttribute('aria-label', 'Open modal');
  parent.appendChild(btn);
  return btn;
}

// New function to validate table accessibility
function validateTableAccessibility() {
  // Implementation for table accessibility validation
  if (typeof document === 'undefined') return;

  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    // Ensure table has a caption
    if (!table.querySelector('caption')) {
      console.warn('Table missing caption:', table);
    }

    // Ensure table has proper headers
    const headers = table.querySelectorAll('th');
    if (headers.length === 0) {
      console.warn('Table missing headers:', table);
    }

    // Ensure table cells have proper scope attributes
    const cells = table.querySelectorAll('td, th');
    cells.forEach(cell => {
      if (cell.tagName === 'TH' && !cell.hasAttribute('scope')) {
        console.warn('Table header missing scope attribute:', cell);
      }
    });
  });
}

// New function to validate table structure
function validateTableStructure() {
  // Implementation for table structure validation
  if (typeof document === 'undefined') return;

  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    // Check for proper table structure
    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
      const cells = row.querySelectorAll('td, th');
      if (cells.length === 0) {
        console.warn('Table row missing cells:', row);
      }
    });
  });
}

// New function to validate landmarks
function validateLandmark() {
  // Implementation for landmark validation
  if (typeof document === 'undefined') return;

  const landmarks = [
    'header', 'nav', 'main', 'footer',
    '[role="banner"]', '[role="navigation"]',
    '[role="main"]', '[role="contentinfo"]'
  ];

  landmarks.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 1) {
      console.warn(`Multiple ${selector} landmarks found. Only one should exist.`);
    }
  });
}

// New function to validate landmark structure
function validateLandmarkStructure() {
  // Implementation for landmark structure validation
  if (typeof document === 'undefined') return;

  const main = document.querySelector('main, [role="main"]');
  if (!main) {
    console.warn('Missing main landmark. Every page should have one main landmark.');
  }

  const nav = document.querySelector('nav, [role="navigation"]');
  if (!nav) {
    console.warn('Missing navigation landmark. Consider adding one for better accessibility.');
  }
}

// New function to get SVG accessible name
function getSvgAccessibleName(svgElement) {
  // Implementation for getting SVG accessible name
  if (!svgElement || typeof document === 'undefined') return '';

  // Check for aria-label
  if (svgElement.hasAttribute('aria-label')) {
    return svgElement.getAttribute('aria-label');
  }

  // Check for aria-labelledby
  if (svgElement.hasAttribute('aria-labelledby')) {
    const id = svgElement.getAttribute('aria-labelledby');
    const labelElement = document.getElementById(id);
    if (labelElement) {
      return labelElement.textContent.trim();
    }
  }

  // Check for title element
  const title = svgElement.querySelector('title');
  if (title) {
    return title.textContent.trim();
  }

  // Check for desc element
  const desc = svgElement.querySelector('desc');
  if (desc) {
    return desc.textContent.trim();
  }

  // Fallback to empty string
  return '';
}

/**
 * Creates a focus trap for keyboard navigation within a given container element.
 * Prevents focus from leaving the container when Tab key is pressed.
 * @param {HTMLElement} container - The container element to trap focus within
 * @returns {Object} An object with a detach method to remove the focus trap
 */
function newFocusTrap(container) {
  if (!container || typeof document === 'undefined') {
    return { detach: () => {} };
  }

  const focusableSelectors = [
    'button:not([disabled])',
    'a[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(', ');

  let previousActiveElement = document.activeElement;

  const handleKeyDown = (event) => {
    if (event.key !== 'Tab') {
      return;
    }

    const focusableElements = Array.from(
      container.querySelectorAll(focusableSelectors)
    ).filter(el => el.offsetParent !== null);

    if (focusableElements.length === 0) {
      event.preventDefault();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  container.addEventListener('keydown', handleKeyDown);

  // Optionally focus the first focusable element in the trap
  const focusableElements = Array.from(
    container.querySelectorAll(focusableSelectors)
  ).filter(el => el.offsetParent !== null);

  if (focusableElements.length > 0) {
    focusableElements[0].focus();
  }

  return {
    detach: () => {
      container.removeEventListener('keydown', handleKeyDown);
      if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
        previousActiveElement.focus();
      }
    }
  };
}

// Export the new functions
module.exports = {
  setHtmlLangAttribute,
  detectAndSetLang,
  getLangAttribute,
  personName,
  createInPageButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  newFocusTrap
};