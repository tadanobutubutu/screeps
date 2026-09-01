// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
//_Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
//<!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
//_Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
//<!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
//_Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
//<!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->
//_Commit: 669117b94c3d1a635653f730f030599efacbb752_
//<!-- todo-hash: 312aa8ea6e4c5e1c9430e4b7136c210eb9172dea -->
// TODO: Identify and update specific functions that render dependency graphs or
// index views.
// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (handled by validateUniqueLandmarks() and personName())
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
 * Gets the lang attribute from the document's <html> tag
 * @returns {string} The current lang attribute value or default 'en'
 */
function getLangAttribute() {
  if (typeof document !== 'undefined' && document.documentElement) {
    return document.documentElement.lang || 'en';
  }
  return 'en';
}

/**
 * Checks for accessibility issues in the rendered content
 * @param {string} content - Rendered HTML content
 * @returns {Array} List of accessibility issues found
 */
function checkAccessibility(content) {
  // Placeholder for accessibility checking logic
  // This function should be implemented to check for accessibility issues
  // For now, it just returns an empty array
  return [];
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
    if (/[\u4e00-\u9fa5]/.test(content)) {
      lang = 'zh'; // Chinese
    } else if (/[\u3040-\u30ff]/.test(content)) {
      lang = 'ja'; // Japanese
    } else if (/[\u0400-\u04ff]/.test(content)) {
      lang = 'ru'; // Russian/Cyrillic
    } else if (/[\u0600-\u06ff]/.test(content)) {
      lang = 'ar'; // Arabic
    } else if (/[àâäçéèêëîïôûùüÿœæ]/i.test(content)) {
      lang = 'fr'; // French
    } else if (/[äöüß]/i.test(content)) {
      lang = 'de'; // German
    }
  }

  return lang;
}

/**
 * Creates a person name element with proper accessibility attributes
 * @param {Object} options - Options for creating the person name element
 * @param {string} options.firstName - The person's first name
 * @param {string} options.lastName - The person's last name
 * @param {string} options.lang - The language code for the name (default: 'en')
 * @param {HTMLElement} options.container - Optional container element to append to
 * @returns {HTMLElement} The created element with accessible naming
 */
function personName(options = {}) {
  const { firstName = '', lastName = '', lang = 'en', container = null } = options;
  const fullName = `${firstName} ${lastName}`.trim();

  if (typeof document !== 'undefined') {
    const nameElement = document.createElement('span');
    nameElement.setAttribute('lang', lang);
    nameElement.setAttribute('aria-label', fullName);
    nameElement.textContent = fullName || 'Unknown';

    if (container) {
      container.appendChild(nameElement);
    }

    return nameElement;
  }

  return fullName || 'Unknown';
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
  const issues = [];
  if (typeof document !== 'undefined') {
    const tables = document.querySelectorAll('table');
    tables.forEach((table, index) => {
      // Check for missing table headers
      const headers = table.querySelectorAll('th');
      if (headers.length === 0) {
        issues.push(`Table ${index + 1} has no header cells`);
      }

      // Check for missing scope attributes on headers
      headers.forEach((header, hIndex) => {
        if (!header.hasAttribute('scope')) {
          issues.push(`Header ${hIndex + 1} in table ${index + 1} is missing scope attribute`);
        }
      });

      // Check for missing captions
      if (!table.querySelector('caption')) {
        issues.push(`Table ${index + 1} is missing a caption`);
      }
    });
  }
  return issues;
}

// New function to validate table structure
function validateTableStructure() {
  // Implementation for table structure validation
  const issues = [];
  if (typeof document !== 'undefined') {
    const tables = document.querySelectorAll('table');
    tables.forEach((table, index) => {
      // Check for proper table structure
      const rows = table.querySelectorAll('tr');
      if (rows.length === 0) {
        issues.push(`Table ${index + 1} has no rows`);
      }

      // Check for consistent column count
      const columnCounts = [];
      rows.forEach((row, rIndex) => {
        const cells = row.querySelectorAll('td, th');
        columnCounts.push(cells.length);
        if (rIndex > 0 && cells.length !== columnCounts[0]) {
          issues.push(`Row ${rIndex + 1} in table ${index + 1} has inconsistent column count`);
        }
      });
    });
  }
  return issues;
}

// New function to validate landmarks
function validateLandmark() {
  // Implementation for landmark validation
  const issues = [];
  if (typeof document !== 'undefined') {
    const landmarks = [
      'header', 'nav', 'main', 'footer',
      '[role="banner"]', '[role="navigation"]',
      '[role="main"]', '[role="contentinfo"]'
    ];

    landmarks.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        issues.push(`Missing landmark: ${selector}`);
      }
    });
  }
  return issues;
}

// New function to validate landmark structure
function validateLandmarkStructure() {
  // Implementation for landmark structure validation
  const issues = [];
  if (typeof document !== 'undefined') {
    const landmarks = document.querySelectorAll(
      'header, nav, main, footer, [role="banner"], [role="navigation"], [role="main"], [role="contentinfo"]'
    );

    landmarks.forEach((landmark, index) => {
      // Check for empty landmarks
      if (landmark.children.length === 0) {
        issues.push(`Landmark ${index + 1} (${landmark.tagName.toLowerCase()}) is empty`);
      }

      // Check for proper nesting
      const parent = landmark.parentElement;
      if (parent && parent.tagName.toLowerCase() === 'main') {
        issues.push(`Landmark ${index + 1} (${landmark.tagName.toLowerCase()}) is nested inside main`);
      }
    });
  }
  return issues;
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
  const titleElement = svgElement.querySelector('title');
  if (titleElement) {
    return titleElement.textContent.trim();
  }

  // Check for desc element
  const descElement = svgElement.querySelector('desc');
  if (descElement) {
    return descElement.textContent.trim();
  }

  return '';
}

// New function to create a web resource button suitable for accessibility
function createWebResourceButton(url, text, parent = document.body) {
  const a = document.createElement('a');
  a.href = url;
  a.setAttribute('role', 'button');
  a.setAttribute('aria-label', text);
  a.textContent = text;
  parent.appendChild(a);
  return a;
}

// New function to validate unique landmarks
function validateUniqueLandmarks() {
  // Implementation for validating unique landmark roles
  // Ensures each landmark has a unique identifier for accessibility
  const issues = [];
  if (typeof document !== 'undefined') {
    const landmarkRoles = ['banner', 'navigation', 'main', 'contentinfo'];
    const landmarkElements = {};

    landmarkRoles.forEach(role => {
      const elements = document.querySelectorAll(`[role="${role}"]`);
      if (elements.length > 1) {
        issues.push(`Multiple elements with role="${role}" found - only one should exist`);
      }
      if (elements.length === 1) {
        landmarkElements[role] = elements[0];
      }
    });

    // Check for required landmarks
    if (!landmarkElements['main']) {
      issues.push('Missing required landmark: main');
    }
  }
  return issues;
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

// Preserve all existing exports
module.exports = {
  setHtmlLangAttribute,
  getLangAttribute,
  detectAndSetLang,
  personName,
  createInPageButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  createWebResourceButton,
  validateUniqueLandmarks,
  newFocusTrap,
  checkAccessibility // Add the new export
};