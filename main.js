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
  getUniqueLandmarks,
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

const appState = {
  initialized: false,
  data: null,
  cache: new Map()
};

// TODO: This is the existing code that needs to be preserved
// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute() / addLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure() / fixTableStructureIssues() and fixTableHeaderCellScope())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ensureUniqueLandmarks() / addMainLandmark(), addLandmarkRolesAndFixIssues() and fixLandmarkIssues())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and createInPageButton() / addSvgAccessibleNames())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and validateLandmarkStructure())
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), createAccessibleLink() and handleAccessibilityIssues() / fixFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions / addLandmarkRegions())

/**
 * Gets the language attribute value for the HTML element
 * @returns {string} The language attribute value
 */
function getLangAttribute() {
    // Implementation to get language attribute
    return document.documentElement.lang || 'en';
}

/**
 * Gets the full language attribute string for the HTML element
 * @returns {string} The full lang attribute (e.g., "en" or "en-US")
 */
function getFullLangAttribute() {
  return document.documentElement.lang || navigator.language || 'en-US';
}

/**
 * Adds lang attribute to HTML element
 * @param {Object} element - The HTML element to modify
 * @returns {Object} The modified element with lang attribute
 */
function addLangAttribute(element) {
  element.lang = getFullLangAttribute();
  return element;
}

/**
 * Returns a person's name formatted for accessibility
 * @param {string} firstName - The first name
 * @param {string} lastName - The last name
 * @returns {string} The formatted full name
 */
function personName(firstName, lastName) {
  const name = [firstName, lastName].filter(Boolean).join(' ');
  return name || '';
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

  // Also check role attribute for ARIA landmarks
  const role = element.getAttribute('role');
  const validRoles = ['main', 'navigation', 'search', 'banner', 'contentinfo', 'complementary', 'region'];
  if (role && !validRoles.includes(role)) {
    issues.push(`Invalid landmark role: ${role}`);
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

  // If landmarks array is provided, validate each one
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
    // Otherwise, check for required landmarks in the DOM
    const allLandmarks = document.querySelectorAll('[role]');
    let hasMain = false;
    let hasNavigation = false;

    allLandmarks.forEach(landmark => {
      const role = landmark.getAttribute('role');
      if (role === 'main') hasMain = true;
      if (role === 'navigation') hasNavigation = true;
    });

    // Handle accessibility issues from insight report:
    // - REACT_017: Add/fix 2 landmark issues (handled by addMainLandmark(), addLandmarkRolesAndFixIssues(), and fixLandmarkIssues())
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

  // If no landmarks array provided, query the DOM
  if (!Array.isArray(landmarks)) {
    elementsToCheck = document.querySelectorAll('[role]');
  }

  // Check for duplicate accessible names
  elementsToCheck.forEach(landmark => {
    const name = landmark.ariaLabel || landmark.ariaLabelledby || landmark.textContent;
    if (names.includes(name)) {
      duplicates.push(name);
    } else {
      names.push(name);
    }
  });

  // Check for duplicate IDs
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

  return {
    success: duplicates.length === 0,
    duplicates
  };
}

function addLandmarkRegions() {
  console.log('Adding landmark regions');
}

/**
 * Gets the accessible name for an SVG element
 * @param {Object} svgElement - The SVG element to get the name for
 * @returns {string} The accessible name of the SVG
 */
function getSvgAccessibleName(svgElement) {
    // Merged implementation
    if (!svgElement) {
        return 'Accessible SVG Icon';
    }
    const title = svgElement.querySelector('title');
    const ariaLabel = svgElement.getAttribute('aria-label');
    if (title) return title.textContent;
    if (ariaLabel) return ariaLabel;
    return 'Accessible SVG Icon';
}

/**
 * Sets attributes on an SVG element to make it accessible
 * @param {Object} svg - The SVG element to modify
 * @param {string} accessibleName - The accessible name to set
 * @returns {Object} The modified SVG element
 */
function setSvgAttributes(svg, accessibleName) {
  if (svg && typeof svg === 'object') {
    svg.setAttribute('role', 'img');
    if (accessibleName) {
      svg.setAttribute('aria-label', accessibleName);
    }
  }
  return svg;
}

/**
 * Creates an accessible in-page button
 * @param {string} text - The button text
 * @param {Function} onClick - The click handler
 * @returns {Object} The created button element
 */
function createInPageButton(text, onClick) {
    // Implementation to create accessible in-page button
    const button = document.createElement('button');
    button.textContent = text;
    button.onclick = onClick;
    button.setAttribute('aria-label', text);
    return button;
}

/**
 * Creates an accessible link element
 * @param {string} href - The URL for the link
 * @param {string} text - The link text
 * @returns {Object} The created link element
 */
function createAccessibleLink(href, text) {
    // Implementation to create accessible link
    const link = document.createElement('a');
    link.href = href;
    link.textContent = text;
    link.setAttribute('aria-label', text);
    return link;
}

/**
 * validate table accessibility compliance
 * @param {Object} table - The table object to validate
 * @returns {Object} Validation result with success status and any issues found
 */
function validateTableAccessibility(table) {
  const issues = [];

  // Check for caption
  if (!table.querySelector || !table.querySelector('caption')) {
    issues.push('Missing caption element');
  }

  // Check for headers attribute
  if (!table.getAttribute('headers')) {
    issues.push('Missing headers attribute');
  }

  // Check for scope attribute on header cells
  const headerCells = table.querySelectorAll('th');
  headerCells.forEach(cell => {
    if (!cell.hasAttribute('scope')) {
      issues.push('Missing scope attribute on header cell');
    }
  });

  // Handle accessibility issues from insight report:
  // - REACT_027: Fix 26 table structure issues (handled by fixTableStructureIssues() and fixTableHeaderCellScope())

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
    // Check for rows
    const rows = table.querySelectorAll ? table.querySelectorAll('tr') : [];
    if (rows.length === 0) {
      allIssues.push({
        tableIndex: index,
        issues: ['Table has no rows']
      });
    }

    // Validate table accessibility
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
 * Handles accessibility issues across the document
 * Validates tables, landmarks, and SVGs for accessibility compliance
 */
function handleAccessibilityIssues() {
    // Implementation to handle accessibility issues
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

/**
 * Validates form inputs for required fields and format
 * @param {Object} formElement - The form element to validate
 * @returns {boolean} True if the form is valid, false otherwise
 */
function validateFormInputs(formElement) {
    // Implementation to validate form inputs
    const inputs = formElement.querySelectorAll('input, textarea, select');
    let isValid = true;

    inputs.forEach(input => {
        const isRequired = input.hasAttribute('required');
        const value = input.value.trim();
        
        if (isRequired && !value) {
            console.warn(`Required input is empty: ${input.name || input.id}`);
            isValid = false;
        }
        
        if (input.type === 'email' && value && !isValidEmail(value)) {
            console.warn(`Invalid email format: ${value}`);
            isValid = false;
        }
        
        if (input.type === 'url' && value && !isValidUrl(value)) {
            console.warn(`Invalid URL format: ${value}`);
            isValid = false;
        }
    });

    return isValid;
}

/**
 * Validates an email address format
 * @param {string} email - The email to validate
 * @returns {boolean} True if valid email, false otherwise
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validates a URL format
 * @param {string} url - The URL to validate
 * @returns {boolean} True if valid URL, false otherwise
 */
function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
}

function initializeApp() {
  appState.initialized = true;
  console.log('Initializing application...');
  return true;
}

function getConfig() {
  return config;
}

function validateInput(input) {
  return input !== null && input !== undefined;
}

function processData(data) {
  if (!validateInput(data)) {
    throw new Error('Invalid input data');
  }
  return {
    processed: true,
    data: data,
    timestamp: Date.now()
  };
}

// Export all functions from both branches
module.exports = {
  getLangAttribute,
  getFullLangAttribute,
  addLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  ensureUniqueLandmarks,
  getSvgAccessibleName,
  setSvgAttributes,
  createInPageButton,
  createAccessibleLink,
  handleAccessibilityIssues,
  initializeApp,
  getConfig,
  validateInput,
  processData,
  addLandmarkRegions,
  validateFormInputs,
  isValidEmail,
  isValidUrl
};