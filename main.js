// TODO: This is the existing code that needs to be preserved
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
} = require('./AccessibilityHelpers')

// Export functions for use in other modules
module.exports = {
  // TODO: This is the existing code that needs to be preserved
  affectedFunction,
  setLangAttribute,
  getLangAttribute,
  detectAndSetLang,
  newFunction,
  anotherNewFunction,
  getSvgAccessibleName,
  addAccessibleName,
  validateLandmark,
  validateLandmarkStructure,
  validateTableAccessibility,
  validateTableStructure,
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
  checkAccessibility,
  validateAccessibilityReport,
  exportUtils,
  addressAccessibilityIssues
}