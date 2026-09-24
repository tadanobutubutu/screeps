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

// TODO: This is the existing code that needs to be preserved
// Commit: 92f16398f621c21f54d5412797665a733930c872

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
 * Gets the current lang attribute from the document's <html> element
 * @returns {string|undefined} The current language code
 */
function getLangAttribute() {
  if (typeof document !== 'undefined' && document.documentElement) {
    return document.documentElement.lang;
  }
  return undefined;
}

function affectedFunction() {
  return main.affectedFunction();
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
  return new XMLSerializer().serializeToString(svg);
}

/**
 * Validates table accessibility
 * @param {HTMLElement} tableElement - The table element to validate
 * @returns {Object} Validation result with valid boolean and errors array
 */
function validateTableAccessibility(tableElement) {
  if (typeof document === 'undefined' || !tableElement) {
    return { valid: false, errors: ['Table element not found or document not available'] };
  }

  const errors = [];
  const thead = tableElement.querySelector('thead');
  const tbody = tableElement.querySelector('tbody');
  const tfoot = tableElement.querySelector('tfoot');
  const thElements = thead ? thead.querySelectorAll('th') : [];
  
  if (!thead && !tbody) {
    errors.push('Table is missing both <thead> and <tbody> elements');
  } else {
    if (!thead) {
      errors.push('Table is missing <thead> element');
    }
    if (!tbody) {
      errors.push('Table is missing <tbody> element');
    }
    if (!tfoot) {
      errors.push('Table is missing <tfoot> element');
    }
  }
  
  if (thElements.length === 0) {
    errors.push('Table header row is missing <th> elements');
  }
  
  thElements.forEach((th, index) => {
    if (!th.hasAttribute('scope')) {
      errors.push(`Table header cell ${index + 1} is missing scope attribute`);
    }
  });
  
  const caption = tableElement.querySelector('caption');
  const hasCaption = !!caption;
  const ariaDescribedBy = tableElement.getAttribute('aria-describedby');
  const hasSummary = ariaDescribedBy ? true : false;
  
  if (!hasCaption && !hasSummary) {
    errors.push('Table is missing a caption or aria-describedby for accessibility');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Function to handle the Google sign-in response
 * @param {Object} response - The credential response from Google
 * @returns {string} The JWT token
 */
function handleCredentialResponse(response) {
  console.log('Credential Response:', response);
  return decodeJwtResponse?.(response?.credential) || '';
}

/**
 * Validates a landmark element
 * @param {HTMLElement} landmark - The landmark element to validate
 * @returns {Object} Validation result
 */
function validateLandmark(landmark) {
  if (!landmark) {
    return { valid: false, errors: ['Landmark element not found'] };
  }
  
  const errors = [];
  const landmarkType = landmark.getAttribute('role');
  
  if (!landmarkType || landmarkType === 'presentation' || landmarkType === 'none') {
    errors.push('Landmark element should have an explicit role attribute');
  }
  
  const validRoles = ['banner', 'navigation', 'main', 'article', 'section', 'aside', 'complementary', 'contentinfo'];
  if (landmarkType && !validRoles.includes(landmarkType)) {
    errors.push(`Landmark has invalid role: ${landmarkType}`);
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Validates landmark structure
 * @param {Array<HTMLElement>} landmarks - Array of landmark elements
 * @returns {Object} Validation result
 */
function validateLandmarkStructure(landmarks) {
  if (!Array.isArray(landmarks) || landmarks.length === 0) {
    return { valid: true, errors: [] };
  }
  
  const errors = [];
  const landmarkRoles = new Map();
  
  landmarks.forEach((landmark, index) => {
    const result = validateLandmark(landmark);
    if (!result.valid) {
      errors.push(...result.errors.map(e => `Landmark ${index + 1}: ${e}`));
    }
    
    const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
    landmarkRoles.set(role, (landmarkRoles.get(role) || 0) + 1);
  });
  
  const mainCount = landmarkRoles.get('main') || 0;
  if (mainCount > 1) {
    errors.push('Document contains multiple main landmarks');
  }
  
  return { valid: errors.length === 0, errors };
}

module.exports = {
  setHtmlLangAttribute,
  getLangAttribute,
  detectAndSetLang,
  affectedFunction,
  newFunction,
  anotherNewFunction,
  addAccessibleName,
  validateTableAccessibility,
  handleCredentialResponse,
  validateLandmark,
  validateLandmarkStructure
};