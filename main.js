import React from 'react';
import { useState, useEffect } from 'react';

/**
 * Adds the lang attribute to the document's <html> tag based on content
 * @param {string} lang language code (e.g., 'en', 'es', 'fr')
 * @returns {string} The lang attribute value that was set
 */
function setHtmlLangAttribute(lang) {
  const [,, , , , document] = window;
  if (document.documentElement) {
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
  let lang = 'en'; // Default to English
  if (content) {
    if (/[一-鿿]/.test(content)) {
      lang = 'zh'; // Chinese
    } else if (/[぀-ヿ]/.test(content)) {
      lang = 'ja'; // Japanese
    } else if (/[Ѐ-ӿ]/.test(content)) {
      lang = 'ru'; // Russian/Cyrillic
    } else if (/[؀-ۿ]/.test(content)) {
      lang = 'ar'; // Arabic
    } else if (/[àâçéèêëîïôùûüÿœæ]+/i.test(content)) {
      lang = 'fr'; // French
    } else if (/[äöüß]+/i.test(content)) {
      lang = 'de'; // German
    }
  }
  setHtmlLangAttribute(lang);
  return lang;
}

/**
 * Get language attribute for HTML element
 * @returns {string} The lang attribute value
 */
function getLangAttribute() {
  const [,, , , , document] = window;
  return (document.documentElement && document.documentElement.lang) || 'en';
}

/**
 * Validate table structure for accessibility
 * @param {HTMLElement} tableElement - The table element to validate
 * @returns {Object} Validation result
 */
function validateTableStructure(tableElement) {
  if (!tableElement) return { valid: false, errors: ['Table element not found'] };

  const errors = [];
  const rows = tableElement.querySelectorAll('tr');

  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('td, th');
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
      const prevCells = prevRow.querySelectorAll('td, th');
      if (cellCount !== prevCells.length) {
        errors.push(`Row ${rowIndex + 1} has inconsistent cell count (${cellCount} vs ${prevCells.length} in previous row)`);
      }
    }
  });

  return { valid: errors.length === 0, errors };
}

/**
 * Validate landmark structure
 * @returns {Object} Validation result
 */
function validateLandmarkStructure() {
  if (typeof document === 'undefined') {
    return { valid: false, errors: ['Document not available'] };
  }

  const errors = [];

  // Check for multiple main landmarks
  const mainElements = document.querySelectorAll('main, [role="main"]');
  if (mainElements.length > 1) {
    errors.push(`Multiple main landmarks found (${mainElements.length}). Only one main landmark should exist.`);
  }

  // Check for proper nesting of landmarks
  const landmarks = document.querySelectorAll('header, nav, main, aside, footer, section, article, [role]');
  landmarks.forEach((landmark) => {
    const parent = landmark.parentElement;
    while (parent) {
      const parentTag = parent.tagName ? parent.tagName.toLowerCase() : '';
      const parentRole = parent.getAttribute('role');

      // Check for invalid nesting
      if (parentTag === 'header' && landmark.tagName && landmark.tagName.toLowerCase() === 'header') {
        errors.push('Nested header elements found');
      }
      if (parentTag === 'footer' && landmark.tagName && landmark.tagName.toLowerCase() === 'footer') {
        errors.push('Nested footer elements found');
      }
      if (!parent.tagName) {
        parent = parent.parentNode;
      } else {
        break;
      }
    }
  });

  return { valid: errors.length === 0, errors };
}

/**
 * Validate landmark uniqueness
 * @returns {Object} Validation result
 */
function validateLandmark() {
  const errors = [];
  const landmarks = ['navigation', 'search', 'main', 'contentinfo', 'complementary', 'form'];
  const usedLandmarks = new Set();

  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(`[role="${landmark}"]`);
    if (elements.length > 1) {
      errors.push(`Multiple elements with role="${landmark}" found`);
    }
    if (elements.length > 0) {
      usedLandmarks.add(landmark);
    }
  });

  return { valid: errors.length === 0, errors };
}

/**
 * Get accessible name for SVG element
 * @param {HTMLElement} svg - The SVG element
 * @returns {string} The accessible name
 */
function getSvgAccessibleName(svg) {
  if (svg.getAttribute('aria-label')) {
    return svg.getAttribute('aria-label');
  }
  if (svg.getAttribute('aria-labelledby')) {
    const labelId = svg.getAttribute('aria-labelledby');
    const labelElement = document.getElementById(labelId);
    return labelElement ? labelElement.textContent : '';
  }
  if (svg.querySelector('title')) {
    return svg.querySelector('title').textContent;
  }
  return 'SVG graphic';
}

/**
 * Check accessibility of landmark elements in the document.
 * @param {HTMLElement} container - The container element to check
 */
function validateLandmark(container) {
  if (!container) {
    throw new Error('Container element is required');
  }

  const landmarkSelectors = [
    'main', 'nav', 'header', 'footer', 'aside',
    '[role="main"]', '[role="navigation"]', '[role="banner"]',
    '[role="contentinfo"]', '[role="complementary"]'
  ];

  const landmarks = document.querySelectorAll(landmarkSelectors.join(', '));
  const landmarkCount = {};

  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
    landmarkCount[role] = (landmarkCount[role] || 0) + 1;
  });

  return landmarkCount;
}

/**
 * Create a functional component for rendering a table with optional validation.
 * @param {{ tableElement: HTMLElement, validate: boolean }} props
 * @returns {JSX.Element} JSX representing the table and validation results
 */
function Table({ tableElement, validate }) {
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!tableElement) return;
    const validationResult = validateTableStructure(tableElement);
    setResult(validationResult);
  }, [tableElement, validate]);

  return (
    <div>
      <table ref={setElementRef(tableElement)}>
        {/* Table rows and cells */}
      </table>
      {result && <div>{`Table validation result: ${JSON.stringify(result)}`}</div>}
    </div>
  );
}

/**
 * A utility function to set a ref on a DOM element.
 * @param {HTMLElement|React.RefObject<HTMLElement>} current - The current DOM element or ref
 * @returns {React.RefCallback<HTMLElement>} The ref callback
 */
function setElementRef(ref) {
  return (current) => {
    if (current && typeof current === 'object') {
      ref.current = current;
    }
  };
}

export {
  setHtmlLangAttribute,
  detectAndSetLang,
  getLangAttribute,
  validateTableStructure,
  validateLandmarkStructure,
  validateLandmark,
  getSvgAccessibleName,
  Table,
  setElementRef
};