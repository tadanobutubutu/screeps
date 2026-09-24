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

function getLangAttribute() {
  if (typeof document !== 'undefined' && document.documentElement) {
    return document.documentElement.lang;
  }
  return null;
}

function detectAndSetLang() {
  // ... implementation ...
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
  return svgElement.outerHTML;
}

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
    if (!th.hasAttribute('scope')) {
      errors.push(`Table header cell ${index + 1} is missing scope attribute`);
    }
  });

  // Check for proper caption or summary
  const hasCaption = !!tableElement.querySelector('caption');
  const hasSummary = tableElement.hasAttribute('summary') || tableElement.hasAttribute('aria-describedby');
  if (!hasCaption && !hasSummary) {
    errors.push('Table is missing a caption or aria-describedby for accessibility');
  }

  return { valid: errors.length === 0, errors };
}

function validateLandmark(element) {
  const role = element.getAttribute('role');
  const tag = element.tagName.toLowerCase();
  const landmarkRoles = ['banner', 'main', 'navigation', 'search', 'complementary', 'contentinfo', 'region', 'form'];
  return landmarkRoles.includes(role) || (tag === 'main');
}

function validateLandmarkStructure() {
  const landmarks = document.querySelectorAll('[role="banner"], [role="main"], [role="navigation"], [role="search"], [role="complementary"], [role="contentinfo"], [role="region"], [role="form"], main');
  const issues = [];
  landmarks.forEach((landmark, index) => {
    if (!landmark.id) {
      issues.push(`Landmark ${index + 1} is missing an id attribute`);
    }
  });
  return { valid: issues.length === 0, issues };
}

function getSvgAccessibleName(svgElement) {
  const title = svgElement.querySelector('title');
  if (title) {
    return title.textContent;
  }
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  const ariaLabelledBy = svgElement.getAttribute('aria-labelledby');
  if (ariaLabelledBy) {
    const labelElement = document.getElementById(ariaLabelledBy);
    if (labelElement) {
      return labelElement.textContent;
    }
  }
  return 'SVG Image';
}

function uniqueLandmarks() {
  const landmarks = document.querySelectorAll('[role="banner"], [role="main"], [role="navigation"], [role="search"], [role="complementary"], [role="contentinfo"], [role="region"], [role="form"], main');
  const ids = new Set();
  const duplicates = [];
  landmarks.forEach((landmark) => {
    const id = landmark.id;
    if (id) {
      if (ids.has(id)) {
        duplicates.push(id);
      } else {
        ids.add(id);
      }
    }
  });
  return duplicates;
}

function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg) => {
    if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby')) {
      const name = getSvgAccessibleName(svg);
      svg.setAttribute('aria-label', name);
    }
  });
}

function checkAccessibility() {
  const issues = [];
  // Check images for alt text
  const images = document.querySelectorAll('img');
  images.forEach((img, index) => {
    if (!img.hasAttribute('alt')) {
      issues.push(`Image ${index + 1} is missing alt attribute`);
    }
  });

  // Check form inputs for labels
  const inputs = document.querySelectorAll('input, select, textarea');
  inputs.forEach((input, index) => {
    if (!input.hasAttribute('id') && !input.hasAttribute('aria-label')) {
      issues.push(`Form control ${index + 1} is missing label or aria-label`);
    }
  });

  // Check for keyboard focus issues
  const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]');
  interactiveElements.forEach((element, index) => {
    if (!element.hasAttribute('tabindex')) {
      element.setAttribute('tabindex', '0');
    }
  });

  return { valid: issues.length === 0, issues };
}

function validateAccessibilityReport() {
  const report = checkAccessibility();
  const tableIssues = validateTableAccessibility(document.querySelector('table'));
  const landmarkIssues = validateLandmarkStructure();
  const duplicateLandmarks = uniqueLandmarks();

  return {
    valid: report.valid && tableIssues.valid && landmarkIssues.valid && duplicateLandmarks.length === 0,
    issues: report.issues.concat(tableIssues.errors, landmarkIssues.issues, duplicateLandmarks.map(id => `Duplicate landmark id: ${id}`))
  };
}

function exportUtils() {
  return {
    setHtmlLangAttribute,
    getLangAttribute,
    detectAndSetLang,
    newFunction,
    anotherNewFunction,
    addAccessibleName,
    validateTableAccessibility,
    validateLandmark,
    validateLandmarkStructure,
    getSvgAccessibleName,
    uniqueLandmarks,
    addSvgAccessibleNames,
    checkAccessibility,
    validateAccessibilityReport
  };
}

function addressAccessibilityIssues() {
  addSvgAccessibleNames();
  addAccessibleNamesToSVGs();
  fixFakeLinkIssues();
  fixFakeLinkIssue();
  fixTableStructure();
  fixLandmarkIssues();
  addMainLandmark();
  addLandmarkRegions();
  ensureUniqueLandmarks();
  fixButtonIdentifiers();
  ensureElementHasId();
  ensureElementHasIdOrigin();
  addAriaLabel();
  renderDependencyGraphs();
  fixDependencyGraphAria();
  addMainLandmarkToIndex();
  focusTrap();
  createInPageButton();
  createWebResourceButton();
  googleSignIn();
  decodeJwtResponse();
}