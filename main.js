const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const path = require('path');
const { a11y } = require('@accessible/react');
const {
  fixTableStructureIssues,
  fixTableHeaderCellScope,
  addMainLandmark,
  addSvgAccessibleNames,
  fixFakeLinks,
  ensureUniqueLandmarks,
  validateLandmark,
  validateLandmarkAttributes,
  validateLandmarkStructure,
  validateTableAccessibility,
  validateTableStructure,
  getSvgAccessibleName,
  addLangAttribute,
  newFocusTrap,
  getAccessibleLinkProps,
  createInPageButton
} = require('./utils');

const config = {
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: process.env.TIMEOUT || 5000,
  debug: true,
  version: '1.0.0'
};

const appState = {
  initialized: false,
  data: null,
  cache: new Map()
};

function getUniqueLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    const elements = Array.from(document.querySelectorAll(landmarkSelectors.join(',')));
    return uniqueLandmarks(elements);
  }

  return uniqueLandmarks(landmarks);
}

function uniqueLandmarks(landmarks) {
  if (!landmarks || !Array.isArray(landmarks)) return [];

  const seen = new Set();
  const uniqueLandmarks = [];

  for (const landmark of landmarks) {
    if (!landmark || typeof landmark.id === 'undefined') continue;

    const landmarkId = typeof landmark.id === 'string' ? landmark.id : String(landmark.id);

    if (!seen.has(landmarkId)) {
      seen.add(landmarkId);
      uniqueLandmarks.push(landmark);
    }
  }

  return uniqueLandmarks;
}

const appData = {
  title: 'Screeps',
  version: '1.0.0'
};

// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by addLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by fixTableStructureIssues() and fixTableHeaderCellScope())
// - REACT_017: Add/fix 2 landmark issues (handled by addMainLandmark(), addLandmarkRolesAndFixIssues() and fixLandmarkIssues())
// - REACT_041: Add accessible names to 2 SVGs (handled by addSvgAccessibleNames())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by fixFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

function getLangAttribute() {
    // Implementation to get language attribute
    return document.documentElement.lang || 'en';
}

function getFullLangAttribute() {
    // Implementation to get full language attribute
    return document.documentElement.lang || navigator.language || 'en-US';
}

/**
 * Validates table accessibility compliance
 * @param {Object} table - The table object to validate
 * @returns {Object} Validation result with success status and any issues found
 */
function validateTableAccessibility(table) {
  const issues = [];

  // Check for caption (from origin/main)
  if (!table.querySelector || !table.querySelector('caption')) {
    issues.push('Missing caption element');
  }

  // Check for headers attribute (from HEAD)
  if (!table.getAttribute('headers')) {
    issues.push('Missing headers attribute');
  }

  // Check for scope attribute on header cells (from HEAD)
  const headerCells = table.querySelectorAll('th');
  headerCells.forEach(cell => {
    if (!cell.hasAttribute('scope')) {
      issues.push('Missing scope attribute on header cell');
    }
  });

  return {
    success: issues.length === 0,
    issues
  };
}

/**
 * Validates the structure of tables for accessibility
 * @param {Array|Object} tables - Array of table objects or single table element to validate
 * @returns {Object} Validation result with success status and any issues found
 */
function validateTableStructure(tables) {
  const allIssues = [];

  // Handle both single table element and array of tables
  const tableArray = Array.isArray(tables) ? tables : [tables];

  tableArray.forEach((table, index) => {
    // Check for rows (from origin/main)
    const rows = table.querySelectorAll ? table.querySelectorAll('tr') : [];
    if (rows.length === 0) {
      allIssues.push({
        tableIndex: index,
        issues: ['Table has no rows']
      });
    }

    // Validate table accessibility (from HEAD)
    const result = validateTableAccessibility(table);
    if (!result.success) {
      allIssues.push({
        tableIndex: index,
        issues: result.issues
      });
    }
  });

  return {
    success: allIssues.length === 0,
    issues: allIssues
  };
}

/**
 * Validates landmark elements for accessibility
 * @param {Object} element - The element to validate
 * @returns {Object} Validation result with success status and any issues found
 */
function validateLandmark(element) {
  const issues = [];
  const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];

  if (!element.tagName) {
    issues.push('Missing tagName');
  } else if (!validLandmarks.includes(element.tagName.toLowerCase())) {
    issues.push(`Invalid landmark: ${element.tagName}`);
  }

  return {
    success: issues.length === 0,
    issues
  };
}

/**
 * Validates the structure of landmark elements
 * @param {Array} landmarks - Array of landmark elements to validate (optional)
 * @returns {Object} Validation result with success status and any issues found
 */
function validateLandmarkStructure(landmarks) {
  const issues = [];

  // If landmarks array is provided, validate each one (from HEAD)
  if (Array.isArray(landmarks)) {
    landmarks.forEach((landmark, index) => {
      const result = validateLandmark(landmark);
      if (!result.success) {
        issues.push({
          landmarkIndex: index,
          issues: result.issues
        });
      }
    });
  } else {
    // Otherwise, check for required landmarks in the DOM (from origin/main)
    const allLandmarks = document.querySelectorAll('[role]');
    let hasMain = false;
    let hasNavigation = false;

    allLandmarks.forEach(landmark => {
      const role = landmark.getAttribute('role');
      if (role === 'main') hasMain = true;
      if (role === 'navigation') hasNavigation = true;
    });

    if (!hasMain) {
      issues.push('Missing main landmark');
    }
    if (!hasNavigation) {
      issues.push('Missing navigation landmark');
    }
  }

  return {
    success: issues.length === 0,
    issues
  };
}

/**
 * Ensures all landmarks have unique accessible names
 * @param {Array} landmarks - Array of landmark elements to check (optional)
 * @returns {Object} Result with success status and any duplicate names found
 */
function ensureUniqueLandmarks(landmarks) {
  const names = [];
  const duplicates = [];
  let elementsToCheck = landmarks;

  // If no landmarks array provided, query the DOM (from origin/main)
  if (!Array.isArray(landmarks)) {
    elementsToCheck = document.querySelectorAll('[role]');
  }

  // Check for duplicate accessible names (from HEAD)
  elementsToCheck.forEach(landmark => {
    const name = landmark.ariaLabel || landmark.ariaLabelledby || landmark.textContent;
    if (names.includes(name)) {
      duplicates.push(name);
    } else {
      names.push(name);
    }
  });

  // Check for duplicate IDs (from origin/main)
  const elementsById = {};
  elementsToCheck.forEach(landmark => {
    if (landmark.id) {
      if (elementsById[landmark.id]) {
        duplicates.push(`Duplicate ID: ${landmark.id}`);
        landmark.id += '_duplicate';
      } else {
        elementsById[landmark.id] = true;
      }
    }
  });

  // Check for duplicate roles (from origin/main)
  const landmarksByRole = {};
  elementsToCheck.forEach(landmark => {
    const role = landmark.getAttribute('role');
    if (role) {
      if (landmarksByRole[role]) {
        duplicates.push(`Duplicate role: ${role}`);
      } else {
        landmarksByRole[role] = true;
      }
    }
  });

  return {
    success: duplicates.length === 0,
    duplicates
  };
}

function fixTableStructure(table) {
  if (!table.headers) {
    table.headers = 'auto';
  }

  if (!table.scope) {
    table.scope = 'auto';
  }

  return table;
}

/**
 * Adds a main landmark to the document if missing
 * @param {Object} document - The document object
 * @returns {Object} The document with main landmark added
 */
function addMainLandmark(document) {
  if (!document.querySelector('main')) {
    const main = document.createElement('main');
    main.setAttribute('role', 'main');
    document.body.appendChild(main);
  }
  return document;
}

/**
 * Sets SVG attributes for accessibility
 * @param {Object} svg - The SVG element
 * @param {string} accessibleName - The accessible name
 * @returns {Object} The SVG element with attributes set
 */
function setSvgAttributes(svg, accessibleName) {
  svg.setAttribute('aria-label', accessibleName);
  svg.setAttribute('role', 'img');
  return svg;
}

/**
 * Handles the credential response from authentication
 * @param {Object} credentialResponse - The credential response object
 * @returns {Object} Processed credential data
 */
function handleCredentialResponse(credentialResponse) {
  if (!credentialResponse || typeof credentialResponse !== 'object') {
    throw new Error('Invalid credential response');
  }

  // Extract and validate required fields
  const { credential, clientExtensionResults, authenticatorData } = credentialResponse;

  if (!credential || typeof credential !== 'string') {
    throw new Error('Invalid credential in response');
  }

  // Process the credential data
  const processedCredential = {
    rawId: credential,
    id: credential,
    response: {
      clientDataJSON: credentialResponse.clientDataJSON,
      authenticatorData: authenticatorData || null,
      signature: credentialResponse.signature || null,
      userHandle: credentialResponse.userHandle || null
    },
    type: 'public-key',
    extensions: clientExtensionResults || {}
  };

  // Validate the processed credential
  if (!processedCredential.response.clientDataJSON) {
    throw new Error('Missing clientDataJSON in credential response');
  }

  return processedCredential;
}

/**
 * Adds proper landmark regions to the document
 * @param {Object} document - The document object
 * @returns {Object} The document with landmark regions added
 */
function addProperLandmarkRegions(document) {
  const regions = [
    { selector: 'header', role: 'banner' },
    { selector: 'nav', role: 'navigation' },
    { selector: 'main', role: 'main' },
    { selector: 'aside', role: 'complementary' },
    { selector: 'footer', role: 'contentinfo' }
  ];

  regions.forEach(region => {
    const elements = document.querySelectorAll(region.selector);
    elements.forEach(element => {
      if (!element.getAttribute('role')) {
        element.setAttribute('role', region.role);
      }
    });
  });

  return document;
}

function handleAccessibilityIssues() {
    // Implementation to handle accessibility issues (conflict resolved: merged implementation)
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        validateTableAccessibility(table);
        validateTableStructure(table);
    });

    const landmarks = document.querySelectorAll('[role]');
    landmarks.forEach(landmark => {
        validateLandmark(landmark);
    });

    validateLandmarkStructure();
    ensureUniqueLandmarks();

    const svgs = document.querySelectorAll('svg');
    svgs.forEach(svg => {
        getSvgAccessibleName(svg);
    });
}

// Export all existing and new functions
module.exports = {
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    ensureUniqueLandmarks,
    getSvgAccessibleName,
    createInPageButton,
    createAccessibleLink,
    fixTableStructure,
    addMainLandmark,
    setSvgAttributes,
    countDependencies,
    handleCredentialResponse,
    addProperLandmarkRegions,
    handleAccessibilityIssues,
    initializeApp,
    getConfig,
    validateInput,
    processData,
    addLandmarkRegions
};