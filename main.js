const main = require('./utilities')

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
} = require('./AccessibilityHelpers')

import React from 'react';

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
    document.documentElement.lang = lang || 'en';
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
  // New function implementation
}

function anotherNewFunction() {
  // Another new function implementation
}

// Implement the function to add an accessible name to SVGs
// Required changes to fix the React SVG Accessible Name issue
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

// Re-export utilities from main module
export const {
  fixTableStructure: fixTableStructureUtil,
  fixLandmarkIssues: fixLandmarkIssuesUtil,
  addMainLandmark: addMainLandmarkUtil,
  addLandmarkRegions: addLandmarkRegionsUtil,
  ensureUniqueLandmarks: ensureUniqueLandmarksUtil,
  addSvgAccessibleName: addSvgAccessibleNameUtil,
  addAccessibleNamesToSVGs: addAccessibleNamesToSVGsUtil,
  fixFakeLinkIssue: fixFakeLinkIssueUtil,
  fixFakeLinkIssues: fixFakeLinkIssuesUtil,
  googleSignIn: googleSignInUtil,
  decodeJwtResponse: decodeJwtResponseUtil,
  fixButtonIdentifiers: fixButtonIdentifiersUtil,
  ensureElementHasId: ensureElementHasIdUtil,
  ensureElementHasIdOrigin: ensureElementHasIdOriginUtil,
  addAriaLabel: addAriaLabelUtil,
  renderDependencyGraphs: renderDependencyGraphsUtil,
  fixDependencyGraphAria: fixDependencyGraphAriaUtil,
  addMainLandmarkToIndex: addMainLandmarkToIndexUtil,
  focusTrap: focusTrapUtil,
  createInPageButton: createInPageButtonUtil,
  createWebResourceButton: createWebResourceButtonUtil,
  checkAccessibility,
  validateAccessibilityReport,
  exportUtils,
  addressAccessibilityIssues
} = main;