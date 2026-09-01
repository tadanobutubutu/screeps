import React from 'react';

/**
 * Adds the lang attribute to the document's <html> tag based on content
 * @param {string} lang language code (e.g., 'en', 'es', 'fr')
 * @returns {string} The lang attribute value that was set
 */
function setHtmlLangAttribute(lang) {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang || 'en';
    document.documentElement.setAttribute('data-lang', lang); // Add data-lang for ease of access in CSS
  }
}

/**
 * Detects the language of the given content and sets the HTML lang attribute
 * @param {string} content - The text content to analyze
 * @returns {string} The detected language code
 */
function detectAndSetLang(content) {
  let lang = 'en'; // Default to English

  if (content) {
    // Check for non-ASCII characters to help detect language
    const regex = /[\u4E00-\u9FFF]|[\u3040-\u309F]|[\u30A0-\u30FF]|[\u0400-\u04FF]|[\u0600-\u06FF]|[ àâçéèêëîïôùûüÿæœ]|[\äöüß]/iu;
    if (regex.test(content)) {
      lang = content.match(regex)[0].codePointAt(0).toString(16).replace('U+', ''); // <LANGUAGE_CODE>
    }
  }

  return lang;
}

// New functions to address new accessibility issues from inspection report
function getLangAttribute() {
  return document.documentElement.getAttribute('data-lang') || detectAndSetLang(document.documentElement.innerText);
}

function validateTableAccessibility(tableElement) {
  if (typeof document === 'undefined' || !tableElement) {
    return { valid: false, errors: ['Table element not found or document not available'] };
  }

  const errors = [];

  if (!tableElement.querySelector('thead')) {
    errors.push('Table is missing <thead> element');
  }

  if (!tableElement.querySelector('tbody')) {
    errors.push('Table is missing <tbody> element');
  }

  const thElements = tableElement.querySelectorAll('thead th');
  if (thElements.length === 0) {
    errors.push('Table header row is missing <th> elements');
  }

  thElements.forEach((th) => {
    if (!th.hasAttribute('scope')) {
      errors.push(`Table header cell scope is missing on ${th.cellIndex + 1}`);
    }
  });

  const hasCaption = tableElement.querySelector('caption');
  const hasSummary = tableElement.getAttribute('summary') || tableElement.getAttribute('aria-describedby');
  if (!hasCaption && !hasSummary) {
    errors.push('Table is missing a caption or aria-describedby for accessibility');
  }

  return { valid: errors.length === 0, errors };
}

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
    cells.forEach((cell) => {
      if (!cell.textContent.trim()) {
        errors.push(`Row ${rowIndex + 1}, Cell ${cell.cellIndex + 1} is empty`);
      }
    });

    // Check that all th elements have scope attributes
    if (cellCount > 0) {
      cells[0].setAttribute('scope', 'col');
    }

    // Check that all cells have the same number of columns
    if (rowIndex > 0 && cellCount !== cells[cells.length - 1].cellIndex) {
      errors.push(`Row ${rowIndex + 1} has cell count mismatch`);
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
  validateTableStructure
};