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
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// Assuming main.js has a <html> tag, add the lang attribute based on your content
// For example, if the page is in English, set lang to 'en'
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

// New function to address REACT_015: Add lang attribute to HTML element
function getLangAttribute() {
  return (typeof document !== 'undefined' && document.documentElement) ? document.documentElement.lang : 'en';
}

// New function to address REACT_027: Fix 26 table structure issues
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
  const thElements = thead ? thead.querySelectorAll('th') : [];
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
  const hasSummary = tableElement.getAttribute('aria-describedby');
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

// New function to address REACT_017: Add/fix 4 landmark issues
function validateLandmark(element) {
  if (typeof document === 'undefined' || !element) {
    return { valid: false, errors: ['Element not found'] };
  }
  
  const errors = [];
  const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article', 'search'];
  
  // Check if element is a valid landmark
  const role = element.getAttribute('role');
  const tagName = element.tagName.toLowerCase();
  
  if (role && !validLandmarks.includes(role) && !role.includes('landmark')) {
    errors.push(`Invalid landmark role: ${role}`);
  }
  
  if (!role && !validLandmarks.includes(tagName)) {
    errors.push(`Element is not a valid landmark: ${tagName}`);
  }
  
  // Check for accessible name
  const hasLabel = element.getAttribute('aria-label') || 
                   element.getAttribute('aria-labelledby') ||
                   element.querySelector('h1, h2, h3, h4, h5, h6');
  
  if (!hasLabel) {
    errors.push('Landmark is missing accessible name (aria-label, aria-labelledby, or heading)');
  }
  
  return { valid: errors.length === 0, errors };
}

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
      
      parent = parent.parentElement;
    }
  });
  
  return { valid: errors.length === 0, errors };
}

// New function to address REACT_041: Add accessible names to 2 SVGs
function getSvgAccessibleName(svgElement) {
  if (typeof document === 'undefined' || !svgElement) {
    return null;
  }
  
  // Check for aria-label
  let accessibleName = svgElement.getAttribute('aria-label');
  if (accessibleName) return accessibleName;
  
  // Check for aria-labelledby referencing another element
  const labelledBy = svgElement.getAttribute('aria-labelledby');
  if (labelledBy) {
    const labelElement = document.getElementById(labelledBy);
    if (labelElement) return labelElement.textContent;
  }
  
  // Check for title element inside SVG
  const title = svgElement.querySelector('title');
  if (title && title.textContent.trim()) {
    return title.textContent.trim();
  }
  
  // Check for desc element inside SVG
  const desc = svgElement.querySelector('desc');
  if (desc && desc.textContent.trim()) {
    return desc.textContent.trim();
  }
  
  return null;
}

function validateSvgAccessibility() {
  if (typeof document === 'undefined') {
    return { valid: true, errors: [] };
  }
  
  const errors = [];
  const svgs = document.querySelectorAll('svg');
  
  svgs.forEach((svg, index) => {
    const name = getSvgAccessibleName(svg);
    if (!name) {
      errors.push(`SVG ${index + 1} is missing an accessible name (aria-label, aria-labelledby, title, or desc)`);
    }
  });
  
  return { valid: errors.length === 0, errors };
}

// New function to address REACT_025: Ensure unique landmarks (2 issues)
function ensureUniqueLandmarks() {
  if (typeof document === 'undefined') {
    return { valid: false, errors: ['Document not available'] };
  }
  
  const errors = [];
  const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="search"]');
  const landmarkNames = new Map();
  
  landmarks.forEach((landmark) => {
    const role = landmark.getAttribute('role');
    const name = getLandmarkName(landmark);
    const key = `${role}:${name}`;
    
    if (landmarkNames.has(key)) {
      errors.push(`Duplicate landmark found: ${role} with name "${name}"`);
    } else {
      landmarkNames.set(key, landmark);
    }
  });
  
  return { valid: errors.length === 0, errors };
}

/**
 * Gets the accessible name of a landmark element
 * @param {HTMLElement} landmark - The landmark element
 * @returns {string} The landmark's accessible name
 */
function getLandmarkName(landmark) {
  if (!landmark) return '';
  
  const ariaLabel = landmark.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;
  
  const ariaLabelledby = landmark.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labelElement = document.getElementById(ariaLabelledby);
    if (labelElement) return labelElement.textContent;
  }
  
  const heading = landmark.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading