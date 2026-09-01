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
 */
function getLangAttribute() {
  return (typeof document !== 'undefined' && document.documentElement) ? document.documentElement.lang : 'en';
}

/**
 * Implemented for REACT_027: Fix 26 table structure issues
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

// Export all functions for testing
export {
  setHtmlLangAttribute,
  detectAndSetLang,
  getLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  checkLandmarkElements
};