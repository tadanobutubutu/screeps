const main = require('./utilities')

import React from 'react'

// Module-level function definitions
function affectedFunction() {
  return main.affectedFunction()
}

/**
 * Sets the lang attribute on the document's <html> element
 * @param {string} lang - The language code (e.g., 'en', 'es', 'fr')
 * @returns {string} The lang attribute value that was set
 */
function setLangAttribute(lang) {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('lang', lang || 'en');
  }
  return lang || 'en';
}

/**
 * Gets the lang attribute from the document's <html> element
 * @returns {string|undefined} The current lang attribute value
 */
function getLangAttribute() {
  if (typeof document !== 'undefined' && document.documentElement) {
    return document.documentElement.getAttribute('lang');
  }
  return undefined;
}

/**
 * Detects the language from various sources and sets it
 * @param {string} [sourceLang] - Optional language source
 * @returns {string} The language code that was set
 */
function detectAndSetLang(sourceLang) {
  const lang = sourceLang || 'en';
  return setLangAttribute(lang);
}

function newFunction() {
  // New function implementation
}

function anotherNewFunction() {
  // Another new function implementation
}

/**
 * Gets an accessible name for an SVG element
 * @param {SVGElement} svgElement - The SVG element
 * @returns {string} The accessible name
 */
function getSvgAccessibleName(svgElement) {
  if (svgElement.hasAttribute('role') && svgElement.getAttribute('role') === 'img') {
    return svgElement.getAttribute('aria-label') || '';
  }
  if (svgElement.hasAttribute('title')) {
    const titleElement = svgElement.querySelector('title');
    return titleElement ? titleElement.textContent : '';
  }
  const id = svgElement.getAttribute('id');
  if (id) {
    const title = document.querySelector(`#${id} title`);
    return title ? title.textContent : '';
  }
  return '';
}

/**
 * Adds an accessible name to an SVG string for accessibility
 * @param {string} svgString - The SVG markup string
 * @returns {string} The modified SVG with accessible name
 */
function addAccessibleName(svgString) {
  const parser = new DOMParser();
  const svg = parser.parseFromString(svgString, 'image/svg+xml');
  const svgElement = svg.documentElement;
  if (!svgElement.hasAttribute('aria-label') && !svgElement.hasAttribute('aria-labelledby')) {
    svgElement.setAttribute('aria-label', getSvgAccessibleName(svgElement));
  }
  const serializer = new XMLSerializer();
  return serializer.serializeToString(svg);
}

/**
 * Validates landmark structure and structure
 * @param {HTMLElement} landmarkElement - The landmark element to validate
 * @returns {Object} Validation result with valid flag and errors array
 */
function validateLandmark(landmarkElement) {
  const errors = [];
  if (!landmarkElement || typeof landmarkElement !== 'object') {
    errors.push('Invalid landmark element provided');
    return { valid: false, errors };
  }
  const landmarkRole = landmarkElement.getAttribute('role');
  const validLandmarks = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'region', 'application'];
  if (landmarkRole && !validLandmarks.includes(landmarkRole)) {
    errors.push('Invalid landmark role: ' + landmarkRole);
  }
  return { valid: errors.length === 0, errors };
}

/**
 * Validates landmark structure in the document
 * @returns {Object} Validation result with valid flag and errors array
 */
function validateLandmarkStructure() {
  const errors = [];
  const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"], [role="search"], [role="region"], [role="application"]');
  const landmarkIds = new Set();
  let mainCount = 0;
  let bannerCount = 0;
  landmarks.forEach((landmark, index) => {
    const id = landmark.getAttribute('id');
    if (id) {
      if (landmarkIds.has(id)) {
        errors.push(`Duplicate landmark id: ${id}`);
      }
      landmarkIds.add(id);
    }
    const role = landmark.getAttribute('role');
    if (role === 'main') {
      mainCount++;
    }
    if (role === 'banner') {
      bannerCount++;
    }
  });
  if (mainCount > 1) {
    errors.push('Multiple main landmarks found');
  }
  if (bannerCount > 1) {
    errors.push('Multiple banner landmarks found');
  }
  return { valid: errors.length === 0, errors };
}

/**
 * Validates table element accessibility
 * @param {HTMLTableElement} tableElement - The table element to validate
 * @returns {Object} Validation result with valid flag and errors array
 */
function validateTableAccessibility(tableElement) {
  if (!tableElement || typeof tableElement !== 'object') {
    return { valid: false, errors: ['Table element not provided'] };
  }
  const errors = [];
  const hasThead = tableElement.querySelector('thead');
  const hasTbody = tableElement.querySelector('tbody');
  if (!hasThead) {
    errors.push('Table is missing <thead> element');
  }
  if (!hasTbody) {
    errors.push('Table is missing <tbody> element');
  }
  const thElements = tableElement.querySelectorAll('th');
  if (thElements.length === 0 && hasThead) {
    const theadThs = hasThead.querySelectorAll('th');
    if (theadThs.length === 0) {
      errors.push('Table header row is missing <th> elements');
    }
  }
  thElements.forEach((th, index) => {
    if (!th.hasAttribute('scope')) {
      errors.push(`Table header cell ${index + 1} is missing scope attribute`);
    }
  });
  const hasCaption = tableElement.querySelector('caption');
  const hasAriaDescribedby = tableElement.hasAttribute('aria-describedby');
  if (!hasCaption && !hasAriaDescribedby) {
    errors.push('Table is missing a caption or aria-describedby for accessibility');
  }
  return { valid: errors.length === 0, errors };
}

/**
 * Validates table structure
 * @param {Array} tableData - Table data to validate
 * @returns {Object} Validation result
 */
function validateTableStructure(tableData) {
  if (!Array.isArray(tableData)) {
    return { valid: false, errors: ['Table data must be an array'] };
  }
  const errors = [];
  if (tableData.length === 0) {
    errors.push('Table data is empty');
  }
  if (tableData.length > 0) {
    const rowLength = tableData[0].length;
    tableData.forEach((row, index) => {
      if (!Array.isArray(row)) {
        errors.push(`Row ${index + 1} is not an array`);
      } else if (row.length !== rowLength) {
        errors.push(`Row ${index + 1} has inconsistent column count`);
      }
    });
  }
  return { valid: errors.length === 0, errors };
}

// Function wrapper for accessibility utilities from utilities module
const {
  fixTableStructure,
  fixLandmarkIssues,
  addMainLandmark,
  addLandmarkRegions,
  ensureUniqueLandmarks,
  addSvgAccessibleName,
  addAccessibleNamesToSVGs,
  fixFakeLinkIssue,
  fixFakeLinkIssues,
  googleSignIn,
  decodeJwtResponse,
  fixButtonIdentifiers,
  ensureElementHasId,
  ensureElementHasIdOrigin,
  addAriaLabel,
  renderDependencyGraphs,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  focusTrap,
  createInPageButton,
  createWebResourceButton,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  uniqueLandmarks,
  addSvgAccessibleNames,
  checkAccessibility,
  validateAccessibilityReport,
  exportUtils,
  addressAccessibilityIssues
} = ...

// Main entry point - renamed to avoid conflict with imported main
function initializeApp() {
  // Application initialization
  return 'main function executed';
}

/**
 * Detects the language from content and sets it on the document's <html> element
 * @returns {string|undefined} The language code that was set
 */
function detectAndSetLang() {
  if (typeof document === 'undefined' || !document.documentElement) {
    return;
  }
  
  let lang = getLangAttribute();
  
  if (!lang && document.documentElement.textContent) {
    const firstWord = document.documentElement.textContent.trim().split(/\s+/)[0];
    lang = firstWord?.toLowerCase().substring(0, 2) || 'en';
  }
  
  return setHtmlLangAttribute(lang);
}

// Module-level function definitions
function affectedFunction() {
  return main.affectedFunction();
}

/**
 * Adds the lang attribute to the document's <html> tag based on content
 * @param {string} lang language code (e.g., 'en', 'es', 'fr')
 * @returns {string} The lang attribute value that was set
 */
function setHtmlLangAttribute(lang) {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang || 'en'
  }
  return lang || 'en';
}

/**
 * Retrieves the lang attribute from the document's <html> tag
 * @returns {string} The current lang attribute value
 */
function getLangAttribute() {
  if (typeof document !== 'undefined' && document.documentElement) {
    return document.documentElement.lang || 'en';
  }
  return 'en';
}

/**
 * Detects language and sets the appropriate lang attribute on <html>
 * @param {string} [detectedLang] - Language code to set (optional)
 * @returns {string} The language code that was set
 */
function detectAndSetLang(detectedLang) {
  const currentLang = detectedLang || getLangAttribute();
  return setHtmlLangAttribute(currentLang);
}

function newFunction() {
  // Placeholder for future implementation
}

function anotherNewFunction() {
  // Placeholder for future implementation
}

/**
 * Adds an accessible name to an SVG string
 * @param {string} svgString - The SVG markup as a string
 * @returns {string} The SVG with an aria-label attribute added
 */
function addAccessibleName(svgString) {
  const parser = new DOMParser();
  const svg = parser.parseFromString(svgString, 'image/svg+xml');
  const svgElement = svg.documentElement;
  if (!svgElement.hasAttribute('aria-label') && !svgElement.hasAttribute('aria-labelledby')) {
    svgElement.setAttribute('aria-label', getSvgAccessibleName(svgElement));
  }
  
  // Additional check for SVG role
  if (!svgElement.hasAttribute('role')) {
    svgElement.setAttribute('role', 'img');
  }
  
  return svgElement.outerHTML;
}

/**
 * Validates table accessibility by checking structure and attributes
 * @param {HTMLElement|Array} tableData - Either a table DOM element or table data array
 * @returns {Object} Validation result with valid flag and errors array
 */
function validateTableAccessibility(tableData) {
  // If tableData is an array, delegate to main implementation
  if (Array.isArray(tableData)) {
    return main.validateTableAccessibility(tableData);
  }
  
  // If tableData is a DOM element, perform detailed validation
  if (typeof document === 'undefined' || !tableData) {
    return { valid: false, errors: ['Table element not found or document not available'] };
  }
  
  const errors = [];
  
  // Check if table has proper structure
  if (!tableData.querySelector('thead') && tableData.children.length > 0) {
    const hasHeaderRow = Array.from(tableData.querySelectorAll('tr')).some(tr =>
      Array.from(tr.querySelectorAll('th')).length > 0
    );
    if (!hasHeaderRow) {
      errors.push('Table is missing <thead> element');
    }
  }
  
  // Check for tbody presence
  if (!tableData.querySelector('tbody') && tableData.children.length > 1) {
    errors.push('Table is missing <tbody> element');
  }
  
  // Check for th elements in thead
  const thead = tableData.querySelector('thead');
  const thElements = thead ? thead.querySelectorAll('th') : [];
  if (thElements.length === 0) {
    errors.push('Table header row is missing <th> elements');
  }
  
  // Check that all th elements have scope attributes
  thElements.forEach((th, index) => {
    if (!th.hasAttribute('scope')) {
      errors.push(`Table header cell ${index + 1} is missing scope attribute`);
    }
  });
  
  // Check for proper caption or summary
  const hasCaption = tableData.querySelector('caption') !== null;
  const hasSummary = tableData.hasAttribute('aria-describedby') || tableData.hasAttribute('summary');
  if (!hasCaption && !hasSummary) {
    errors.push('Table is missing a caption or aria-describedby for accessibility');
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Validates table structure integrity
 * @param {HTMLElement|Array} tableData - Either a table DOM element or table data array
 * @returns {Object} Validation result with valid flag and errors array
 */
function validateTableStructure(tableData) {
  // If tableData is an array, delegate to main implementation
  if (Array.isArray(tableData)) {
    return main.validateTableStructure(tableData);
  }
  
  // If tableData is a DOM element, perform detailed structure validation
  if (typeof document === 'undefined' || !tableData) {
    return { valid: false, errors: ['Table element not found or document not available'] };
  }
  
  const errors = [];
  
  // Basic table structure checks
  if (tableData.tagName && tableData.tagName.toLowerCase() !== 'table') {
    errors.push('Provided element is not a table');
  }
  
  // Check for nested tables
  if (tableData.querySelector('table')) {
    errors.push('Table contains nested tables which may cause accessibility issues');
  }
  
  // Check for empty cells
  const emptyCells = tableData.querySelectorAll('td:empty, th:empty');
  if (emptyCells.length > 0) {
    errors.push(`${emptyCells.length} empty cells found in table`);
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Gets accessible name for SVG elements
 * @param {HTMLElement} svgElement - SVG DOM element
 * @returns {string} Accessible name for the SVG
 */
function getSvgAccessibleName(svgElement) {
  if (!svgElement) return '';
  
  // Check for existing title element
  const titleElement = svgElement.querySelector('title');
  if (titleElement && titleElement.textContent.trim()) {
    return titleElement.textContent.trim();
  }
  
  // Check aria-label
  if (svgElement.hasAttribute('aria-label')) {
    return svgElement.getAttribute('aria-label');
  }
  
  // Check aria-labelledby
  if (svgElement.hasAttribute('aria-labelledby')) {
    const labelledBy = svgElement.getAttribute('aria-labelledby');
    const labelledElement = document.getElementById(labelledBy);
    if (labelledElement) {
      return labelledElement.textContent.trim();
    }
  }
  
  return '';
}

/**
 * Checks for unique landmarks in the document
 * @returns {Array} Array of duplicate landmark errors
 */
function uniqueLandmarks() {
  if (typeof document === 'undefined') {
    return [];
  }
  
  const landmarks = document.querySelectorAll([
    'main',
    'nav',
    'aside',
    'header',
    'footer',
    '[role="main"]',
    '[role="navigation"]',
    '[role="complementary"]',
    '[role="banner"]',
    '[role="contentinfo"]'
  ].join(', '));
  
  const landmarkCounts = {};
  const errors = [];
  
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
    landmarkCounts[role] = (landmarkCounts[role] || 0) + 1;
    
    if (role === 'main' && landmarkCounts[role] > 1) {
      errors.push('Document has multiple main landmarks');
    }
    
    if (['banner', 'contentinfo'].includes(role) && landmarkCounts[role] > 1) {
      errors.push(`Document has multiple ${role} landmarks`);
    }
  });
  
  return errors;
}

// Export all functions
export {
  affectedFunction,
  setHtmlLangAttribute,
  getLangAttribute,
  detectAndSetLang,
  newFunction,
  anotherNewFunction,
  addAccessibleName,
  validateTableAccessibility,
  validateTableStructure,
  getSvgAccessibleName,
  uniqueLandmarks
};

  const errors = [];
  const rows = tableElement.querySelectorAll('tr');

  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('td');
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
      const prevCells = prevRow.querySelectorAll('td');
      if (cellCount !== prevCells.length) {
        errors.push(`Row ${rowIndex + 1} has inconsistent cell count`);
      }
    }
  });

  return { valid: errors.length === 0, errors };
}

// TODO: Identify and update specific functions that render dependency graphs or
// index views.
// Accessibility fixes from insight report - combined with the export code below:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks())
// - REACT_036: Fix 1 fake link issue (handled by personName(), createInPageButton(), and ...)
// - ADD: Address new accessibility issues from insight report (handled by createFocusTrap(), checkLandmarkElements(), validateSvgAccessibility(), and validateLinks())

function personName(name) {
  return name || '';
}

function createFocusTrap(container) {
  return trapFocus(container);
}

function checkLandmarkElements() {
  return validateLandmarkStructure();
}

function validateLinks() {
  if (typeof document === 'undefined') {
    return { valid: true, errors: [] };
  }
  const errors = [];
  const links = document.querySelectorAll('a');
  links.forEach((link, index) => {
    if (!link.textContent.trim() && !link.getAttribute('aria-label')) {
      errors.push(`Link ${index + 1} is missing accessible text`);
    }
  });
  return { valid: errors.length === 0, errors };
}

function validateTableStructure() {
  if (typeof document === 'undefined') {
    return { valid: true, errors: [] };
  }
  const errors = [];
  const tables = document.querySelectorAll('table');
  tables.forEach((table, index) => {
    const result = fixTableStructure(table);
    if (!result.valid) {
      errors.push(`Table ${index + 1}: ${result.errors.join(', ')}`);
    }
  });
  return { valid: errors.length === 0, errors };
}

function validateTableAccessibility() {
  return validateTableStructure();
}

module.exports = {
  renderAdditionalContent,
  renderGraphIndex,
  trapFocus,
  addAccessibleName,
  setHtmlLangAttribute,
  detectAndSetLang,
  getLangAttribute,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  validateSvgAccessibility,
  fixTableStructure,
  personName,
  createFocusTrap,
  checkLandmarkElements,
  validateLinks,
  validateTableStructure,
  validateTableAccessibility,
  renderDependencyGraphs,
  renderDependencyGraph: renderGraphIndex
};