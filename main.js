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
    document.documentElement.lang = lang || 'en';
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