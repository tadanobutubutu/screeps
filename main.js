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
 * Gets the language attribute from the document's <html> tag
 * @returns {string} The lang attribute value
 */
function getLangAttribute() {
  if (typeof document !== 'undefined' && document.documentElement) {
    return document.documentElement.lang || 'en';
  }
  return 'en';
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
 * Detects the language from page content and sets the lang attribute
 * @returns {string} The detected/used language code
 */
function detectAndSetLang() {
  // Implementation to detect language from page content
  const content = document.body.textContent || '';
  // Detect language algorithm would go here
  const lang = 'en'; // Default
  return setHtmlLangAttribute(lang);
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
  return new XMLSerializer().serializeToString(svg);
}

function validateTableAccessibility(tableElement) {
  if (typeof document === 'undefined' || !tableElement) {
    return { valid: false, errors: ['Table element not found or document not available'] };
  }
  
  const errors = [];
  
  // Check if table has proper structure
  const hasTHead = tableElement.querySelector('thead') !== null;
  const hasTBody = tableElement.querySelector('tbody') !== null;
  
  if (!hasTHead) {
    errors.push('Table is missing <thead> element');
  }
  
  if (!hasTBody) {
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
    if (!th.hasAttribute('scope')) {
      errors.push(`Table header cell ${index + 1} is missing scope attribute`);
    }
  });
  
  // Check for proper caption or summary
  const hasCaption = tableElement.querySelector('caption') !== null;
  const hasSummary = tableElement.hasAttribute('summary') || tableElement.hasAttribute('aria-describedby');
  if (!hasCaption && !hasSummary) {
    errors.push('Table is missing a caption or aria-describedby for accessibility');
  }
  
  return { valid: errors.length === 0, errors };
}

function validateTableStructure(tableData) {
  return main.validateTableStructure(tableData);
}

function validateLandmark(landmarkElement) {
  if (typeof document === 'undefined' || !landmarkElement) {
    return { valid: false, errors: ['Landmark element not found or document not available'] };
  }
  
  const errors = [];
  const validRoles = ['banner', 'navigation', 'main', 'article', 'aside', 'footer', 'header', 'complementary'];
  
  // Check if element has a valid landmark role
  const role = landmarkElement.getAttribute('role');
  if (!role || !validRoles.includes(role)) {
    errors.push('Element is missing a valid landmark role');
  }
  
  // Check that landmark has accessible name
  const hasLabel = landmarkElement.hasAttribute('aria-label');
  const hasLabelledBy = landmarkElement.hasAttribute('aria-labelledby');
  const hasTitle = landmarkElement.tagName === 'TITLE' || landmarkElement.querySelector('title');
  
  if (!hasLabel && !hasLabelledBy && !hasTitle) {
    errors.push('Landmark element is missing an accessible name');
  }
  
  return { valid: errors.length === 0, errors };
}

function validateLandmarkStructure(landmarkElement) {
  if (typeof document === 'undefined' || !landmarkElement) {
    return { valid: false, errors: ['Landmark element not found or document not available'] };
  }
  
  const errors = [];
  
  // Check for nested landmarks (should not have another landmark of same type)
  const role = landmarkElement.getAttribute('role');
  if (role) {
    const nestedLandmarks = landmarkElement.querySelectorAll(`[role="${role}"]`);
    if (nestedLandmarks.length > 1) {
      errors.push(`Landmark has nested landmarks with the same role "${role}"`);
    }
  }
  
  // Check for redundant landmark roles
  const html5Roles = ['header', 'nav', 'main', 'article', 'aside', 'footer'];
  if (role && html5Roles.includes(role)) {
    const tagName = landmarkElement.tagName.toLowerCase();
    if (tagName === role || (tagName === 'header' && role === 'banner')) {
      errors.push('Element has redundant landmark role (HTML5 element implicitly defines landmark)');
    }
  }
  
  return { valid: errors.length === 0, errors };
}

function getSvgAccessibleName(svgElement) {
  if (!svgElement) return '';
  
  // Check for title element
  const titleElement = svgElement.querySelector('title');
  if (titleElement && titleElement.textContent) {
    return titleElement.textContent;
  }
  
  // Check for desc element
  const descElement = svgElement.querySelector('desc');
  if (descElement && descElement.textContent) {
    return descElement.textContent;
  }
  
  return 'SVG graphic';
}

// Function to handle the Google sign-in and generate a JWT response
function handleCredentialResponse(response) {
  console.log('Credential Response:', response);
}

// Button creation functions
function createInPageButton() {
  // Implementation for creating an in-page button
}

function createWebResourceButton() {
  // Implementation for creating a web resource button
}

// Function to render dependency graphs
function renderDependencyGraphs() {
  // Implementation for rendering dependency graphs
}

// Additional required functions from AccessibilityHelpers
function fixButtonIdentifiers() {
  return main.fixButtonIdentifiers();
}

function ensureElementHasId(element) {
  return main.ensureElementHasId(element);
}

function ensureElementHasIdOrigin(element) {
  return main.ensureElementHasIdOrigin(element);
}

function addAriaLabel(element, label) {
  if (element && typeof label === 'string') {
    element.setAttribute('aria-label', label);
  }
}

function addMainLandmarkToIndex() {
  // Implementation to add main landmark to index
}

function focusTrap() {
  // Implementation for focus trapping
}

function validateAccessibilityReport() {
  // Implementation to validate accessibility report
}

function exportUtils() {
  // Implementation to export utilities
}

function addressAccessibilityIssues() {
  // Implementation to address accessibility issues
}

function checkAccessibility() {
  // Implementation to check accessibility
}

function uniqueLandmarks() {
  // Implementation to ensure unique landmarks
}

function addSvgAccessibleNames() {
  // Implementation to add accessible names to SVGs
}

module.exports = {
  affectedFunction,
  getLangAttribute,
  setHtmlLangAttribute,
  detectAndSetLang,
  addAccessibleName,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  handleCredentialResponse,
  createInPageButton,
  createWebResourceButton,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  ensureElementHasId,
  ensureElementHasIdOrigin,
  addAriaLabel,
  addMainLandmarkToIndex,
  focusTrap,
  validateAccessibilityReport,
  exportUtils,
  addressAccessibilityIssues,
  checkAccessibility,
  uniqueLandmarks,
  addSvgAccessibleNames,
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
  addAriaLabel,
  fixDependencyGraphAria
};