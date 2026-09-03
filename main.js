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

// Set HTML language attribute for accessibility
function setHtmlLangAttribute(lang) {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang || 'en';
  }
  return lang || 'en';
}

// Placeholder functions from HEAD
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
}

// Table validation functions
function validateTableAccessibility(tableElement) {
  if (typeof document === 'undefined' || !tableElement) {
    return { valid: false, errors: ['Table element not found or document not available'] };
  }

  const errors = [];

  // Check if table has proper structure
  if (!tableElement.hasNodeName('table')) {
    errors.push('Table element not found');
  }

  // Check for thead/tbody presence
  const thead = tableElement.querySelector('thead');
  const tbody = tableElement.querySelector('tbody');

  if (!thead) {
    errors.push('Missing <thead> element');
  }
  if (!tbody) {
    errors.push('Missing <tbody> element');
  }

  // Check for th elements in thead
  const thElements = thead?.querySelectorAll('th');
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
  const hasSummary = tableElement.querySelector('summary');

  if (!hasCaption && !hasSummary) {
    errors.push('Table is missing a caption or aria-describedby for accessibility');
  }

  return { valid: errors.length === 0, errors };
}

function validateTableStructure(tableElement) {
  if (typeof document === 'undefined' || !tableElement) {
    return { valid: false, errors: ['Table element not found or document not available'] };
  }

  const errors = [];

  // Check for proper number of rows
  const totalRows = tableElement.querySelectorAll('tr').length;
  if (totalRows === 0) {
    errors.push('Table has no rows');
  }

  // Check for proper column headers
  const headerRow = tableElement.querySelector('thead tr');
  if (headerRow) {
    const thCount = headerRow.querySelectorAll('th').length;
    if (thCount === 0) {
      errors.push('Table header row is missing <th> elements');
    }
  }

  // Validate that each row has at least one cell
  tableElement.querySelectorAll('tr').forEach(row => {
    if (row.children.length === 0) {
      errors.push('Row has no cells');
    }
  });

  return { valid: errors.length === 0, errors };
}

// Landmark validation functions
function validateLandmark(landmark) {
  if (!landmark || typeof landmark !== 'object') {
    return { valid: false, errors: ['Invalid landmark object'] };
  }

  const hasRole = landmark.hasOwnProperty('role');
  const hasId = landmark.hasOwnProperty('id');
  const hasLabel = landmark.hasOwnProperty('label');

  if (!hasRole) {
    return { valid: false, errors: ['Landmark missing role attribute'] };
  }

  if (!hasId) {
    return { valid: false, errors: ['Landmark missing id attribute'] };
  }

  if (!hasLabel) {
    return { valid: false, errors: ['Landmark missing label attribute'] };
  }

  return { valid: true, errors: [] };
}

function validateLandmarkStructure(landmark) {
  if (!landmark.hasOwnProperty('role') || landmark.role !== 'img') {
    return { valid: false, errors: ['Landmark must have role="img"'] };
  }

  if (!landmark.id) {
    return { valid: false, errors: ['Landmark missing id'] };
  }

  // Additional structure checks
  if (landmark.role === 'img' && !landmark.hasAttribute('alt')) {
    return { valid: false, errors: ['Image landmark missing alt attribute'] };
  }

  return { valid: true, errors: [] };
}

// SVG accessible name helper
function getSvgAccessibleName(svgElement) {
  const text = svgElement.textContent.trim();
  if (text) {
    return text;
  }
  return '';
}

// Export utilities
exportUtils = main.exportUtils;
addressAccessibilityIssues = main.addressAccessibilityIssues;

// New accessible web resource button utility
function createWebResourceButton(buttonText, url, iconUrl, className = '') {
  /**
   * Creates an accessible web resource button following ARIA guidelines.
   * 
   * @param {string} buttonText - The display text for the button
   * @param {string} url - The URL to navigate to when clicked
   * @param {string} [iconUrl] - Optional icon URL for visual indication
   * @param {string} [className] - Optional CSS class for styling
   * @returns {JSX.Element} An accessible button component
   */
  const Button = () => (
    <button
      onClick={() => window.location.href = url}
      aria-label={buttonText}
      aria-pressed={false}
      className={className}
      type="button"
    >
      {iconUrl ? <i className="icon">{iconUrl}</i> : null}
      {buttonText}
    </button>
  );

  return Button;
}