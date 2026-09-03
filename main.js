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
} = main;

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
 * Gets the current lang attribute from the document's <html> tag
 * @returns {string} The current lang attribute value
 */
function getHtmlLangAttribute() {
  if (typeof document !== 'undefined' && document.documentElement) {
    return document.documentElement.lang || 'en';
  }
  return 'en';
}

/**
 * Creates an in-page button with accessibility support
 * @param {Object} options - Button configuration options
 * @param {string} options.id - Unique identifier for the button
 * @param {string} options.label - Button text/label
 * @param {Function} options.onClick - Click handler function
 * @param {string} [options.className] - Optional CSS class name
 * @param {string} [options.ariaLabel] - Optional aria-label for accessibility
 * @param {boolean} [options.disabled] - Whether the button is disabled
 * @param {string} [options.type] - Button type ('button', 'submit', 'reset')
 * @returns {HTMLButtonElement} The created button element
 */
function createInPageButton({ id, label, onClick, className = '', ariaLabel, disabled = false, type = 'button' }) {
  const button = document.createElement('button');
  
  // Set basic attributes
  button.type = type;
  button.id = id;
  button.textContent = label;
  
  // Add accessibility attributes
  if (ariaLabel) {
    button.setAttribute('aria-label', ariaLabel);
  }
  
  if (disabled) {
    button.disabled = true;
    button.setAttribute('aria-disabled', 'true');
  }
  
  // Add CSS class
  if (className) {
    button.className = className;
  }
  
  // Add click handler
  if (typeof onClick === 'function') {
    button.addEventListener('click', onClick);
  }
  
  // Ensure the button has a unique accessible name
  if (!ariaLabel && !label) {
    button.setAttribute('aria-label', 'In-page action button');
  }
  
  return button;
}

/**
 * Creates a web resource button with enhanced features
 * @param {Object} options - Button configuration options
 * @param {string} options.text - Button text
 * @param {string} options.url - URL to navigate to
 * @param {string} [options.target] - Target attribute ('_self', '_blank', etc.)
 * @param {boolean} [options.external] - Whether the link opens in a new tab
 * @returns {HTMLButtonElement} The created button element
 */
function createWebResourceButton({ text, url, target = '_self', external = false }) {
  const button = document.createElement('button');
  
  button.textContent = text;
  button.setAttribute('data-url', url);
  button.setAttribute('data-target', target);
  
  if (external) {
    button.setAttribute('aria-label', `${text} (opens in new tab)`);
    button.setAttribute('target', '_blank');
    button.setAttribute('rel', 'noopener noreferrer');
  }
  
  button.addEventListener('click', () => {
    if (external) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = url;
    }
  });
  
  return button;
}

function newFunction() {
  // New function implementation placeholder
  return true;
}

function anotherNewFunction() {
  // Another new function implementation placeholder
  return true;
}

// Function to add an accessible name to SVGs
function addSvgAccessibleName(svgElement, name) {
  if (!svgElement || !name) return false;
  
  // Check if SVG already has an accessible name
  const hasTitle = svgElement.querySelector('title');
  const hasDesc = svgElement.querySelector('desc');
  const hasAriaLabel = svgElement.getAttribute('aria-label');
  const hasLabelledBy = svgElement.getAttribute('aria-labelledby');
  
  // If already has an accessible name, return early
  if (hasTitle || hasDesc || hasAriaLabel || hasLabelledBy) {
    return true;
  }
  
  // Add a title element for accessibility
  const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
  title.textContent = name;
  svgElement.insertBefore(title, svgElement.firstChild);
  
  // Set aria-label for additional support
  svgElement.setAttribute('aria-label', name);
  
  return true;
}

// Function to validate table accessibility
function validateTableAccessibility(tableElement) {
  if (typeof document === 'undefined' || !tableElement) {
    return { valid: false, errors: ['Table element not found or document not available'] };
  }
  
  const errors = [];
  
  // Check if table has proper structure
  const thead = tableElement.querySelector('thead');
  const tbody = tableElement.querySelector('tbody');
  
  if (!thead) {
    errors.push('Table is missing <thead> element');
  }
  
  if (!tbody) {
    errors.push('Table is missing <tbody> element');
  }
  
  // Check for th elements in thead
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
  const hasCaption = tableElement.querySelector('caption');
  const summaryAttr = tableElement.getAttribute('summary');
  const ariaDescribedBy = tableElement.getAttribute('aria-describedby');
  
  if (!hasCaption && !summaryAttr && !ariaDescribedBy) {
    errors.push('Table is missing a caption or aria-describedby for accessibility');
  }
  
  return { valid: errors.length === 0, errors };
}

// Function to validate landmark structure
function validateLandmarkStructure(element) {
  if (!element) return { valid: false, errors: ['Element not provided'] };
  
  const errors = [];
  const landmarks = element.querySelectorAll('[role]');
  
  landmarks.forEach((landmark) => {
    const role = landmark.getAttribute('role');
    if (!role) {
      errors.push('Landmark missing role attribute');
    }
    
    // Check for main landmark
    if (role === 'main' && !landmark.textContent.trim()) {
      errors.push('Main landmark is empty');
    }
  });
  
  return { valid: errors.length === 0, errors };
}

// Function to handle the Google sign-in and generate a JWT response
function handleCredentialResponse(response) {
  console.log('Credential Response:', response);
  
  if (response.credential) {
    const decodedToken = decodeJwtResponse(response.credential);
    console.log('Decoded Token:', decodedToken);
    return decodedToken;
  }
  
  return null;
}

// Additional implementation functions
function fixTableStructure(tableData) {
  return main.fixTableStructure(tableData);
}

function fixLandmarkIssues(container) {
  return main.fixLandmarkIssues(container);
}

function addMainLandmark(container) {
  return main.addMainLandmark(container);
}

function addLandmarkRegions(container) {
  return main.addLandmarkRegions(container);
}

function ensureUniqueLandmarks(container) {
  return main.ensureUniqueLandmarks(container);
}

function addAccessibleNamesToSVGs(container) {
  return main.addAccessibleNamesToSVGs(container);
}

function fixFakeLinkIssue(link) {
  return main.fixFakeLinkIssue(link);
}

function fixFakeLinkIssues(container) {
  return main.fixFakeLinkIssues(container);
}

function googleSignIn() {
  return main.googleSignIn();
}

function decodeJwtResponse(token) {
  return main.decodeJwtResponse(token);
}

function fixButtonIdentifiers(container) {
  return main.fixButtonIdentifiers(container);
}

function ensureElementHasId(element) {
  return main.ensureElementHasId(element);
}

function ensureElementHasIdOrigin(element) {
  return main.ensureElementHasIdOrigin(element);
}

function addAriaLabel(element, label) {
  return main.addAriaLabel(element, label);
}

function renderDependencyGraphs(container) {
  return main.renderDependencyGraphs(container);
}

function fixDependencyGraphAria(container) {
  return main.fixDependencyGraphAria(container);
}

function addMainLandmarkToIndex(indexPage) {
  return main.addMainLandmarkToIndex(indexPage);
}

function focusTrap(container) {
  return main.focusTrap(container);
}

function validateLandmark(element) {
  return main.validateLandmark(element);
}

function getSvgAccessibleName(svgElement) {
  return main.getSvgAccessibleName(svgElement);
}

function uniqueLandmarks(container) {
  return main.uniqueLandmarks(container);
}

function addSvgAccessibleNames(container) {
  return main.addSvgAccessibleNames(container);
}

function checkAccessibility(container) {
  return main.checkAccessibility(container);
}

function validateAccessibilityReport(report) {
  return main.validateAccessibilityReport(report);
}

function exportUtils() {
  return main.exportUtils();
}

function addressAccessibilityIssues(container) {
  return main.addressAccessibilityIssues(container);
}

// Export all functions
module.exports = {
  createInPageButton,
  createWebResourceButton,
  setHtmlLangAttribute,
  getHtmlLangAttribute,
  affectedFunction,
  validateTableAccessibility,
  validateTableStructure: main.validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  addSvgAccessibleName,
  addAccessibleNamesToSVGs,
  fixTableStructure,
  fixLandmarkIssues,
  addMainLandmark,
  addLandmarkRegions,
  ensureUniqueLandmarks,
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
  getSvgAccessibleName,
  uniqueLandmarks,
  checkAccessibility,
  validateAccessibilityReport,
  exportUtils,
  addressAccessibilityIssues,
  handleCredentialResponse
};