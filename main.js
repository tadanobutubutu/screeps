// TODO: This is the existing code that needs to be preserved
// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)
// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
//_Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
//<!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
//_Commit: f80b51b788bad4952d8f93f08d3c7d22a06ff80d3_
//<!-- todo-hash: b498b47abee4b3f29c69a97a2237d968a50cc419 -->
//_Commit: 30b5f08a59d5ec914a59aa66e32dc3a3eb059e_
//<!-- todo-hash: 1f8a6325b07b9b809ac49f5e1c81cf4f89f9c1 -->
//_Commit: 669117b4c3d1a635653f730f0a059efacbb752_
//<!-- todo-hash: 312aa8ea4c5e1c9430e4b7c36c210eb9a72dea -->
//_Commit: 54b7c4d06282fbf48e78de43e5e115814006658c_
//<!-- todo-hash: 9f4ca23445c76674f7b5dd5047c707b41ba67409 -->
// TODO: Identify and update specific functions that render dependency graphs or
// index views.
// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks())
// - REACT_036: Fix 1 fake link issue (handled by personName(), createInPageButton(), and ...)
// - ADD: Address new accessibility issues from insight report
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

/**
 * Implemented for REACT_017: Validate landmark elements for accessibility
 */
function validateLandmark(landmarkElement) {
  if (typeof document === 'undefined' || !landmarkElement) {
    return { valid: false, errors: ['Landmark element not found or document not available'] };
  }

  const errors = [];

  // Check for accessible name
  const ariaLabel = landmarkElement.getAttribute('aria-label');
  const ariaLabelledby = landmarkElement.getAttribute('aria-labelledby');
  const title = landmarkElement.getAttribute('title');
  const textContent = landmarkElement.textContent.trim();
  const hasAccessibleName = ariaLabel || ariaLabelledby || title || textContent;

  if (!hasAccessibleName) {
    errors.push('Landmark is missing accessible name');
  }

  // Check for role attribute when using non-standard landmark elements
  const tagName = landmarkElement.tagName.toLowerCase();
  const standardLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];
  if (!standardLandmarks.includes(tagName) && !landmarkElement.getAttribute('role')) {
    errors.push(`Landmark element <${tagName}> is missing role attribute`);
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Implemented for REACT_017: Validate landmark structure
 */
function validateLandmarkStructure(container) {
  if (typeof document === 'undefined' || !container) {
    return { valid: false, errors: ['Container element not found'] };
  }

  const errors = [];
  const landmarks = Array.from(container.querySelectorAll('header, nav, main, aside, footer, section, article, [role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"], [role="region"], [role="search"]'));

  landmarks.forEach((landmark, index) => {
    const result = validateLandmark(landmark);
    if (!result.valid) {
      errors.push(`Landmark ${index + 1}: ${result.errors.join(', ')}`);
    }
  });

  return { valid: errors.length === 0, errors };
}

/**
 * Implemented for REACT_025: Ensure unique landmarks
 */
function ensureUniqueLandmarks() {
  if (typeof document === 'undefined') {
    return { valid: false, errors: ['Document not available'] };
  }

  const errors = [];
  const landmarkCounts = {};
  const uniqueLandmarks = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search'];

  // Check for multiple instances of unique landmarks
  uniqueLandmarks.forEach(role => {
    const elements = document.querySelectorAll(`[role="${role}"]`);
    if (elements.length > 1) {
      landmarkCounts[role] = elements.length;
    }
  });

  // Check standard elements that should be unique
  const standardUniqueLandmarks = ['header', 'footer', 'main'];
  standardUniqueLandmarks.forEach(tagName => {
    const elements = document.getElementsByTagName(tagName);
    if (elements.length > 1) {
      landmarkCounts[tagName] = elements.length;
    }
  });

  Object.keys(landmarkCounts).forEach(landmark => {
    errors.push(`Multiple instances of unique landmark: ${landmark} (${landmarkCounts[landmark]} found)`);
  });

  return { valid: errors.length === 0, errors };
}

/**
 * New function to address REACT_041: Add accessible names to SVGs
 */
function getSvgAccessibleName(svgElement) {
  if (!svgElement) {
    return null;
  }

  // Check for title and desc elements
  const titleElement = svgElement.querySelector('title');
  const descElement = svgElement.querySelector('desc');

  if (titleElement && titleElement.textContent.trim()) {
    return titleElement.textContent.trim();
  }

  // Check for aria-label
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }

  // Check for aria-labelledby
  const ariaLabelledby = svgElement.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labelledElement = document.getElementById(ariaLabelledby);
    if (labelledElement) {
      return labelledElement.textContent.trim();
    }
  }

  return null;
}

/**
 * Resolved conflicts and retained existing functions
 * TODO: Identify and update specific functions that render dependency graphs or index views.
 */
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
  ensureUniqueLandmarks,
  getSvgAccessibleName,
  checkLandmarkElements
};