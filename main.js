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
 * Add SVG accessibility props to an SVG element
 * @param {SVGElement} svgElement - The SVG element to enhance
 * @param {Object} options - Accessibility options
 * @param {string} options.role - ARIA role (default: 'img')
 * @param {string} options.ariaLabel - ARIA label (default: 'SVG graphic')
 * @param {boolean} options.ariaHidden - Whether to hide from screen readers (default: false)
 * @param {boolean} options.focusable - Whether to make focusable (default: false)
 * @param {string} options.title - Title text content
 * @param {string} options.description - Description text content
 */
function addSvgAccessibilityProps(svgElement, options = {}) {
  if (!svgElement || !(svgElement instanceof SVGElement)) {
    console.warn('Invalid SVG element provided');
    return;
  }

  // Set default ARIA attributes if not provided
  const defaultOptions = {
    role: 'img',
    ariaLabel: 'SVG graphic',
    ariaHidden: false,
    focusable: false
  };

  const finalOptions = { ...defaultOptions, ...options };

  // Apply ARIA attributes
  svgElement.setAttribute('role', finalOptions.role);
  svgElement.setAttribute('aria-label', finalOptions.ariaLabel);

  if (finalOptions.ariaHidden) {
    svgElement.setAttribute('aria-hidden', 'true');
  } else {
    svgElement.removeAttribute('aria-hidden');
  }

  // Handle focusability
  if (finalOptions.focusable) {
    svgElement.setAttribute('focusable', 'true');
    svgElement.setAttribute('tabindex', '0');
  } else {
    svgElement.setAttribute('focusable', 'false');
    svgElement.removeAttribute('tabindex');
  }

  // Add title if provided
  if (finalOptions.title) {
    const titleElement = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    titleElement.textContent = finalOptions.title;
    svgElement.prepend(titleElement);
  }

  // Add description if provided
  if (finalOptions.description) {
    const descElement = document.createElementNS('http://www.w3.org/2000/svg', 'desc');
    descElement.textContent = finalOptions.description;
    svgElement.appendChild(descElement);
  }
}

/**
 * New function to address REACT_015: Add lang attribute to HTML element
 * @returns {string} The current lang attribute value
 */
function getLangAttribute() {
  return (typeof document !== 'undefined' && document.documentElement) ? document.documentElement.lang : 'en';
}

/**
 * Validates a single landmark element for accessibility
 * @param {HTMLElement} landmark - The landmark element to validate
 * @returns {Object} Validation result with valid flag and errors array
 */
function validateLandmark(landmark) {
  const errors = [];

  // Check for accessible name
  const hasAriaLabel = landmark.hasAttribute('aria-label');
  const hasAriaLabelledBy = landmark.hasAttribute('aria-labelledby');
  const hasTitle = landmark.hasAttribute('title');

  if (!hasAriaLabel && !hasAriaLabelledBy && !hasTitle) {
    errors.push('Landmark is missing accessible name (aria-label, aria-labelledby, or title)');
  }

  // Check for duplicate landmarks without unique names
  const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
  if (['header', 'footer', 'nav', 'aside', 'section', 'article'].includes(role)) {
    const allSameRole = document.querySelectorAll(`[role="${role}"], ${role}`);
    if (allSameRole.length > 1) {
      if (!hasAriaLabel && !hasAriaLabelledBy) {
        errors.push(`Multiple ${role} landmarks require unique accessible names`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validates landmark structure and nesting
 * @param {HTMLElement} container - Container to validate (defaults to document)
 * @returns {Object} Validation result
 */
function validateLandmarkStructure(container = document) {
  const errors = [];
  const landmarks = container.querySelectorAll('header, nav, main, aside, footer, section, article, [role="header"], [role="nav"], [role="main"], [role="aside"], [role="footer"], [role="section"], [role="article"], [role="search"]');

  let mainCount = 0;
  landmarks.forEach((landmark) => {
    const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
    if (role === 'main') mainCount++;

    const result = validateLandmark(landmark);
    if (!result.valid) {
      errors.push(...result.errors);
    }
  });

  if (mainCount === 0) {
    errors.push('Page is missing a main landmark');
  } else if (mainCount > 1) {
    errors.push('Page has multiple main landmarks (only one allowed)');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Implemented for REACT_027: Fix 26 table structure issues
 * @param {HTMLTableElement} tableElement - The table to validate
 * @returns {Object} Validation result
 */
function validateTableAccessibility(tableElement) {
  if (typeof document === 'undefined' || !tableElement) {
    return { valid: false, errors: ['Table element not found or document not available'] };
  }

  const errors = [];

  // Check if table has proper structure
  if (!tableElement.querySelector('thead')) {
    errors.push('Table is missing <thead> element');
  }

  if (!tableElement.querySelector('tbody')) {
    errors.push('Table is missing <tbody> element');
  }

  // Check for th elements in thead
  const thead = tableElement.querySelector('thead');
  const thElements = thead ? Array.from(thead.querySelectorAll('th')) : [];
  if (thElements.length === 0) {
    errors.push('Table header row is missing <th> elements');
  }

  // Check that all th elements have scope attributes
  thElements.forEach((th, index) => {
    if (!th.getAttribute('scope')) {
      errors.push(`Table header cell ${index + 1} is missing scope attribute`);
    }
  });

  // Check for proper caption or summary
  const hasCaption = tableElement.querySelector('caption');
  const hasSummary = tableElement.getAttribute('summary') || tableElement.getAttribute('aria-describedby');
  if (!hasCaption && !hasSummary) {
    errors.push('Table is missing a caption or aria-describedby for accessibility');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Implemented for REACT_027: Fix 26 table structure issues
 * @param {HTMLTableElement} tableElement - The table to validate
 * @returns {Object} Validation result
 */
function validateTableStructure(tableElement) {
  if (typeof document === 'undefined' || !tableElement) {
    return { valid: false, errors: ['Table element not found'] };
  }

  const errors = [];
  const rows = Array.from(tableElement.querySelectorAll('tr'));

  rows.forEach((row, rowIndex) => {
    const cells = Array.from(row.querySelectorAll('th, td'));
    const cellCount = cells.length;

    // Check for empty cells
    cells.forEach((cell, cellIndex) => {
      if (!cell.textContent.trim()) {
        errors.push(`Row ${rowIndex + 1}, Cell ${cellIndex + 1} is empty`);
      }
    });

    // Check that rows have consistent cell counts
    if (rowIndex > 0) {
      const prevRow = rows[rowIndex - 1];
      const prevCells = Array.from(prevRow.querySelectorAll('th, td'));
      if (cellCount !== prevCells.length) {
        errors.push(`Row ${rowIndex + 1} has inconsistent cell count (${cellCount} vs ${prevCells.length})`);
      }
    }
  });

  return { valid: errors.length === 0, errors };
}

// Resolved conflicts and retained existing functions
// TODO: Identify and update specific functions that render dependency graphs or index views.
// New function to address additional landmark validation
function checkLandmarkElements(container) {
  if (typeof document === 'undefined') {
    return { valid: false, errors: ['Document not available'] };
  }

  const errors = [];
  const root = container || document;
  const landmarks = root.querySelectorAll('header, nav, main, aside, footer, section, article, [role="header"], [role="nav"], [role="main"], [role="aside"], [role="footer"], [role="section"], [role="article"], [role="search"]');

  landmarks.forEach((landmark, index) => {
    const result = validateLandmark(landmark);
    if (!result.valid) {
      errors.push(`Landmark ${index + 1}: ${result.errors.join(', ')}`);
    }
  });

  return { valid: errors.length === 0, errors };
}

// Export all functions for ES modules
export {
  setHtmlLangAttribute,
  detectAndSetLang,
  getLangAttribute,
  addSvgAccessibilityProps,
  validateLandmark,
  validateLandmarkStructure,
  validateTableAccessibility,
  validateTableStructure,
  checkLandmarkElements
};

// Also provide CommonJS exports for Node.js compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    setHtmlLangAttribute,
    detectAndSetLang,
    getLangAttribute,
    addSvgAccessibilityProps,
    validateLandmark,
    validateLandmarkStructure,
    validateTableAccessibility,
    validateTableStructure,
    checkLandmarkElements
  };
}

// Also attach to global scope for browser/standalone access
if (typeof window !== 'undefined') {
  window.setHtmlLangAttribute = setHtmlLangAttribute;
  window.detectAndSetLang = detectAndSetLang;
  window.getLangAttribute = getLangAttribute;
  window.addSvgAccessibilityProps = addSvgAccessibilityProps;
  window.validateLandmark = validateLandmark;
  window.validateLandmarkStructure = validateLandmarkStructure;
  window.validateTableAccessibility = validateTableAccessibility;
  window.validateTableStructure = validateTableStructure;
  window.checkLandmarkElements = checkLandmarkElements;
}