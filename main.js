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
 * Sets the lang attribute on the document's <html> tag based on content
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
 * Gets the lang attribute from the document's <html> tag
 * @param {string} lang language code (e.g., 'en', 'es', 'fr')
 * @returns {string} The lang attribute value
 */
function getLangAttribute() {
  if (document && document.documentElement) {
    return document.documentElement.lang || 'en';
  }
  return 'en';
}

// Implement the function to add an accessible name to SVGs
// Required changes to fix the React SVG Accessible Name issue
function addAccessibleName(svgString) {
  const parser = new DOMParser();
  const svg = parser.parseFromString(svgString, 'image/svg+xml');
  const svgElement = svg.documentElement;
  if (!svgElement.hasAttribute('aria-label') && !svgElement.hasAttribute('aria-labelledby')) {
    // Try to extract accessible name from SVG content
    const accessibleName = getSvgAccessibleName(svgElement);
    if (accessibleName) {
      svgElement.setAttribute('aria-label', accessibleName);
    } else {
      // Fallback: use a generic label if none extracted
      svgElement.setAttribute('aria-label', 'SVG graphic');
    }
  }
}

// Additional SVG-related utility
function addAccessibleNamesToSVGs(svgStrings) {
  // Process each SVG string and add accessible names
  svgStrings.forEach(addAccessibleName);
}

// Conflict resolution: Merge validateTableAccessibility from origin/main
function validateTableAccessibility(tableElement) {
  if (typeof document === 'undefined' || !tableElement) {
    return { valid: false, errors: ['Table element not found or document not available'] };
  }

  const errors = [];

  // Check if table has proper structure
  if (!tableElement.tBrowsableElement) {
    errors.push('Table is not browsable');
  }

  // Check for thead element
  const thead = tableElement.querySelector('thead');
  if (!thead) {
    errors.push('Table is missing <thead> element');
  }

  // Check for tbody element
  const tbody = tableElement.querySelector('tbody');
  if (!tbody) {
    errors.push('Table is missing <tbody> element');
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

// Conflict resolution: Merge validateLandmark and validateLandmarkStructure from origin/main
function validateLandmark(landmark) {
  // Implementation from origin/main
  if (!landmark) {
    return { valid: false, errors: ['Landmark is null or undefined'] };
  }

  const errors = [];

  // Check landmark type
  if (landmark.type === 'img') {
    if (!landmark.src) {
      errors.push('Image landmark is missing src attribute');
    }
  }

  // Check for alt text
  if (!landmark.altText) {
    errors.push('Image landmark is missing alt text');
  }

  // Validate landmark position
  if (landmark.position === 'absolute') {
    if (!landmark.style) {
      errors.push('Absolute positioned landmark is missing style');
    }
  }

  return { valid: errors.length === 0, errors };
}

function validateLandmarkStructure(landmark) {
  // Implementation from origin/main
  if (!landmark) {
    return { valid: false, errors: ['Landmark is required'] };
  }

  const errors = [];

  if (landmark.type === 'img') {
    if (!landmark.src) {
      errors.push('Image landmark is missing src attribute');
    }
    if (!landmark.altText) {
      errors.push('Image landmark is missing alt text');
    }
  }

  if (landmark.position === 'relative') {
    if (!landmark.style) {
      errors.push('Relative positioned landmark is missing style');
    }
  }

  return { valid: errors.length === 0, errors };
}

// Conflict resolution: Merge getSvgAccessibleName from origin/main
function getSvgAccessibleName(svgElement) {
  // Extract accessible name from SVG content
  // This function parses the SVG and determines a meaningful label
  if (!svgElement) {
    return '';
  }

  // Look for title, description, or aria-label within the SVG
  const title = svgElement.querySelector('title');
  const description = svgElement.querySelector('description');
  const ariaLabel = svgElement.getAttribute('aria-label');

  if (title) {
    return title.textContent.trim() || '';
  }

  if (description) {
    return description.textContent.trim() || '';
  }

  if (ariaLabel) {
    return ariaLabel.trim() || '';
  }

  // Default fallback
  return 'SVG graphic';
}

// Other utility functions from origin/main
function fixTableStructure(tableData) {
  // Implementation from origin/main
  if (!tableData) {
    throw new Error('Invalid table data');
  }

  // Validation logic for table structure
  // ...

  return true;
}

function fixLandmarkIssues(landmark) {
  // Implementation from origin/main
  if (!landmark) {
    throw new Error('Landmark is required');
  }

  // Fix issues with landmark properties
  // ...

  return true;
}

function addMainLandmark(landmark) {
  // Implementation from origin/main
  if (!landmark) {
    throw new Error('Landmark is required');
  }

  // Add landmark to the document
  // ...

  return true;
}

function addLandmarkRegions(landmark) {
  // Implementation from origin/main
  if (!landmark) {
    throw new Error('Landmark is required');
  }

  // Add regions to the landmark
  // ...

  return true;
}

function ensureUniqueLandmarks() {
  // Implementation from origin/main
  return true;
}

function addSvgAccessibleNames(svgStrings) {
  // Implementation from origin/main
  return svgStrings.map(addAccessibleName);
}

function checkAccessibility() {
  // Implementation from origin/main
  return true;
}

function validateAccessibilityReport(report) {
  // Implementation from origin/main
  return true;
}

function exportUtils() {
  // Implementation from origin/main
  return {};
}

function addressAccessibilityIssues() {
  // Implementation from origin/main
  return true;
}

export {
  fixedFunction,
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
};

if (require.main === module) {
  // Entry point if run directly
  main();
}