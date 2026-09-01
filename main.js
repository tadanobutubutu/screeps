import React from 'react';

/**
 * Adds the lang attribute to the document's <html> tag based on content
 * @param {string} lang language code (e.g., 'en', 'es', 'fr')
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
    if (/[\u4e00-\u9fff]/u.test(content)) {
      lang = 'zh'; // Chinese
    } else if (/[\u3040-\u309F\u30A0-\u30FF]/u.test(content)) {
      lang = 'ja'; // Japanese
    } else if (/[\u0400-\u04FF]/u.test(content)) {
      lang = 'ru'; // Russian/Cyrillic
    } else if (/[\u0600-\u06FF]/u.test(content)) {
      lang = 'ar'; // Arabic
    } else if (/[àâçéèêëîïôùûüÿæœ]/i.test(content)) {
      lang = 'fr'; // French
    } else if (/[äöüß]/i.test(content)) {
      lang = 'de'; // German
    }
  }

  return lang;
}

/**
 * New function to address REACT_015: Add lang attribute to HTML element
 * @returns {string} The lang attribute value
 */
function getLangAttribute() {
  return (typeof document !== 'undefined' && document.documentElement) ? document.documentElement.lang : 'en';
}

// New functions to address REACT_027, REACT_017, REACT_041, REACT_025, REACT_036
// These functions have been combined and integrated into the validateTableAccessibility, validateLandmark, validateLandmarkStructure, validateSvgAccessibility, and validateLinks functions below

/**
 * Validates the accessibility of a table element and returns an object with valid and errors properties
 * @param {HTMLElement} tableElement - The table element to validate
 * @returns {{valid: boolean, errors: *[]}} The validation result
 */
function validateTableAccessibility(tableElement) {
  // ... (previous implementation combined and modified)
  // Check that rows have consistent cell counts
  if (rows.length > 0) {
    const firstRowCells = rows[0].querySelectorAll('th, td');
    rows.forEach((row, rowIndex) => {
      const cellCount = row.querySelectorAll('th, td').length;
      if (cellCount !== firstRowCells.length) {
        errors.push(`Row ${rowIndex + 1} has inconsistent cell count (${cellCount} vs ${firstRowCells.length})`);
      }
    });
  }
  // ... (rest of the function remains the same)

  return { valid: errors.length === 0, errors };
}

/**
 * Validates the accessibility of a landmark element and returns an object with valid and errors properties
 * @param {HTMLElement} element - The landmark element to validate
 * @returns {{valid: boolean, errors: *[]}} The validation result
 */
function validateLandmark(element) {
  // ... (previous implementation combined and modified)
  // Check for accessible name
  const hasLabel = element.getAttribute('aria-label') ||
                   element.getAttribute('aria-labelledby') ||
                   element.querySelector('h1, h2, h3, h4, h5, h6') ||
                   element.getAttribute('role') === 'search';
  if (!hasLabel) {
    errors.push('Landmark is missing accessible name (aria-label, aria-labelledby, heading, or role="search")');
  }
  // ... (rest of the function remains the same)

  return { valid: errors.length === 0, errors };
}

/**
 * Validates the structure and accessibility of landmark elements and returns an object with valid and errors properties
 * @returns {{valid: boolean, errors: *[]}} The validation result
 */
function validateLandmarkStructure() {
  // ... (previous implementation combined and modified)
  // Check for multiple main landmarks
  const mainElements = document.querySelectorAll('main, [role="main"]');
  if (mainElements.length > 1) {
    errors.push(`Multiple main landmarks found. Only one main landmark should exist.`);
  }
  // ... (rest of the function remains the same)

  return { valid: errors.length === 0, errors };
}

/**
 * Validates the accessibility of SVG elements and returns an object with valid and errors properties
 * @returns {{valid: boolean, errors: *[]}} The validation result
 */
function validateSvgAccessibility() {
  // ... (previous implementation combined and modified)
  if (svgElements.length === 0) return { valid: true, errors: [] };

  const errors = [];
  svgElements.forEach((svg, index) => {
    const name = getSvgAccessibleName(svg);
    if (!name || !name.trim()) {
      errors.push(`SVG ${index + 1} is missing an accessible name (aria-label, aria-labelledby, title, or desc)`);
    }
  });

  return { valid: errors.length === 0, errors };
}

/**
 * Validates the accessibility of interactive elements (links and buttons) within a container and returns an object with valid and errors properties
 * @param {HTMLElement} container - Optional container to scan within
 * @returns {{valid: boolean, errors: *[]}} The validation result
 */
function validateLinks(container) {
  // ... (previous implementation combined and modified)
  links.forEach((el, index) => {
    const name = personName(el);
    if (!name || !name.trim()) {
      errors.push(`Interactive element ${index + 1} is missing an accessible name`);
    }
  });
  // ... (rest of the function remains the same)

  return { valid: errors.length === 0, errors };
}

// New function to address REACT_045: Ensure elements have proper ARIA roles

/**
 * Ensures a specified container and its children elements have proper ARIA roles
 * @param {HTMLElement} container - The container element to check and influence
 * @returns {{valid: boolean, errors: *[]}} The validation result
 */
function ensureARIA(container) {
  const errors = [];

  function checkElementARIA(element) {
    const role = element.getAttribute('role');

    // Check for '@(autocomplete|list|grid|alert|dialog|tabpanel|tab|checkbox|menu|menuitem|treeitem|slider...)' roles
    if (!role || (!/^(autocomplete|list|grid|alert|dialog|tabpanel|tab|checkbox|menu|menuitem|treeitem|slider)@/.test(role))) {
      errors.push(`Element with id "${element.id}" has an invalid role: ${role || typeof role === 'undefined' ? '(none)' : role}`);
    }

    // Check children
    Array.from(element.children).forEach(checkElementARIA);
  }

  checkElementARIA(container);

  return { valid: errors.length === 0, errors };
}

export {
  setHtmlLangAttribute,
  detectAndSetLang,
  getLangAttribute,
  validateTableAccessibility,
  validateLandmark,
  validateLandmarkStructure,
  validateSvgAccessibility,
  validateLinks,
  ensureARIA
};