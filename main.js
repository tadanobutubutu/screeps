// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
//_Commit: 243c66538868c6b87845660312397ab39e0f830d_
//<!-- todo-hash: ... -->

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
 * Gets the current lang attribute value from the document's <html> tag
 * @returns {string} The current lang attribute value, or 'en' as default
 */
function getLangAttribute() {
  if (typeof document !== 'undefined' && document.documentElement) {
    return document.documentElement.lang || 'en';
  }
  return 'en';
}

/**
 * Detects the appropriate language and sets it on the HTML element
 * @returns {string} The lang attribute value that was set
 */
function detectAndSetLang() {
  const lang = (typeof navigator !== 'undefined' && navigator.language) ? navigator.language : 'en';
  return setHtmlLangAttribute(lang);
}

// New function placeholders (kept from HEAD)
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
  return svgElement.outerHTML;
}

/**
 * Validates the accessibility of a table element
 * @param {HTMLElement} tableElement - The table element to validate
 * @returns {Object} Validation result with valid flag and errors array
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
    if (!th.hasAttribute('scope')) {
      errors.push(`Table header cell ${index + 1} is missing scope attribute`);
    }
  });

  // Check for proper caption or summary
  const hasCaption = !!tableElement.querySelector('caption');
  const hasSummary = !!tableElement.getAttribute('aria-describedby') || !!tableElement.querySelector('summary');
  if (!hasCaption && !hasSummary) {
    errors.push('Table is missing a caption or aria-describedby for accessibility');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Wrapper for data-based table accessibility validation
 * @param {Object|Array} tableData - Table data to validate
 * @returns {Object} Validation result from main module
 */
function validateTableAccessibilityData(tableData) {
  return main.validateTableAccessibility(tableData);
}

/**
 * Validates landmark structure
 * @param {HTMLElement} element - The element to validate landmarks for
 * @returns {Object} Validation result with valid flag and errors array
 */
function validateLandmarkStructureLocal(element) {
  if (typeof document === 'undefined' || !element) {
    return { valid: false, errors: ['Element not found or document not available'] };
  }

  const errors = [];
  const landmarks = Array.from(element.querySelectorAll('[role], main, nav, header, footer, aside, section'));

  landmarks.forEach((landmark, index) => {
    if (!landmark.hasAttribute('aria-label') && !landmark.hasAttribute('aria-labelledby')) {
      errors.push(`Landmark ${index + 1} is missing an accessible name`);
    }
  });

  return { valid: errors.length === 0, errors };
}

/**
 * Validates landmark accessibility
 * @param {HTMLElement} element - The element to validate
 * @returns {Object} Validation result with valid flag and errors array
 */
function validateLandmarkLocal(element) {
  if (typeof document === 'undefined' || !element) {
    return { valid: false, errors: ['Element not found or document not available'] };
  }

  const errors = [];

  // Check for main landmark
  const mainElements = element.querySelectorAll('main, [role="main"]');
  if (mainElements.length === 0) {
    errors.push('Page is missing a main landmark');
  } else if (mainElements.length > 1) {
    errors.push('Page has multiple main landmarks');
  }

  // Check for navigation landmark
  const navElements = element.querySelectorAll('nav, [role="navigation"]');
  if (navElements.length === 0) {
    errors.push('Page is missing a navigation landmark');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Wrapper for table structure validation
 * @param {Object|Array} tableData - Table data to validate
 * @returns {Object} Validation result from main module
 */
function validateTableStructure(tableData) {
  return main.validateTableStructure(tableData);
}

// Function to handle the Google sign-in and generate a JWT response
function handleCredentialResponse(response) {
  console.log('Credential Response:', response);
}

// Export all functions for module use
module.exports = {
  affectedFunction,
  setHtmlLangAttribute,
  getLangAttribute,
  detectAndSetLang,
  newFunction,
  anotherNewFunction,
  addAccessibleName,
  validateTableAccessibility,
  validateTableAccessibilityData,
  validateLandmark,
  validateLandmarkStructure,
  validateLandmarkLocal,
  validateLandmarkStructureLocal,
  validateTableStructure,
  handleCredentialResponse,
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
  getSvgAccessibleName,
  uniqueLandmarks,
  addSvgAccessibleNames,
  checkAccessibility,
  validateAccessibilityReport,
  exportUtils,
  addressAccessibilityIssues
};