const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const path = require('path');
const { a11y } = require('@accessible/react');
const {
  fixTableStructureIssues,
  fixTableHeaderCellScope,
  addMainLandmark,
  addLandmarkRolesAndFixIssues,
  fixLandmarkIssues,
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

const config = {
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  timeout: process.env.TIMEOUT || 5000,
  debug: true,
  version: '1.0.0'
};

const appState = {
  initialized: false,
  data: null,
  cache: new Map()
};

const appData = {
  title: 'Screeps',
  version: '1.0.0'
};

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
    return document.documentElement.lang || (typeof navigator !== 'undefined' && navigator.language) || 'en-US';
}

/**
 * Validates table accessibility compliance
 * @param {Object} table - The table object to validate
 * @returns {Object} Validation result with success status and any issues found
 */
function validateTableAccessibility(table) {
  const issues = [];

  // Check for caption, headers, and scope attributes (merged implementation)
  if (!table.querySelector || !table.querySelector('caption')) {
    issues.push('Missing caption element');
  }
  if (!table.getAttribute('headers')) {
    issues.push('Missing headers attribute');
  }
  if (!table.querySelectorAll('th').every(cell => cell.hasAttribute('scope'))) {
    issues.push('Missing scope attribute on header cell');
  }

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

  // Add missing roles, fix issues, and validate attributes (from HEAD)
  if (element.tagName.toLowerCase() === 'footer') {
    addLandmarkRolesAndFixIssues(element);
    validateLandmarkAttributes(element);
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

    if (!hasMain || !hasNavigation) {
      issues.push('Missing main or required navigation landmarks');
    }
  }

  const landmarksByRole = {};
  const allLandmarks = document.querySelectorAll('[role]');

  allLandmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    if (landmarksByRole[role]) {
      console.warn(`Duplicate landmark role: ${role}`);
    } else {
      landmarksByRole[role] = true;
    }
  });

  return {
    success: issues.length === 0,
    issues
  };
}

function addLandmarkRegions() {
  console.log('Adding landmark regions');
}

function getSvgAccessibleName(svgElement) {
    // Merged implementation (conflict resolved)
    if (!svgElement) return 'Accessible SVG Icon';

    const title = svgElement.querySelector('title');
    const ariaLabel = svgElement.getAttribute('aria-label');
    if (title) return title.textContent;
    if (ariaLabel) return ariaLabel;
    return 'Accessible SVG Icon';
}

function setSvgAttributes(svg, accessibleName) {
  if (svg && typeof svg === 'object') {
    svg.setAttribute('role', 'img');
    if (accessibleName) {
      svg.setAttribute('aria-label', accessibleName);
    }
  }

  return true;
}

function fetchUser(userId) {
  return { id: userId, name: 'User' };
}

function clearCache() {
  appState = {};
}

// Main execution
function main() {
  initialize();
  console.log('Main function executed');
}

function formatDate(date) {
  // Placeholder function
  return new Date(date).toISOString();
}

/**
 * Fixes scope attribute on header cells
 */
function fixTableHeaderCellScope() {
    const headerCells = document.querySelectorAll('th');
    headerCells.forEach(cell => {
        if (!cell.hasAttribute('scope')) {
            cell.setAttribute('scope', 'col');
        }
    });
}

/**
 * Adds main landmark
 */
function addMainLandmark() {
    const main = document.querySelector('main');
    if (!main) {
        const newMain = document.createElement('main');
        document.body.insertBefore(newMain, document.body.firstChild);
    }
}

/**
 * Adds landmark roles and fixes issues
 */
function addLandmarkRolesAndFixIssues() {
    // Add roles to sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        if (!section.hasAttribute('role')) {
            section.setAttribute('role', 'region');
        }
    });
}

/**
 * Fixes landmark issues
 */
function fixLandmarkIssues() {
    // Ensure unique landmarks
    ensureUniqueLandmarks();
}

/**
 * Fixes fake links
 */
function fixFakeLinks() {
    const fakeLinks = document.querySelectorAll('a[href="#"]');
    fakeLinks.forEach(link => {
        link.setAttribute('role', 'button');
        link.setAttribute('aria-label', link.textContent);
    });

    // Add googleSignIn() and fixButtonIdentifiers() functions (from conflicting commit)
    googleSignIn();
    fixButtonIdentifiers();
}

/**
 * Adds proper landmark regions
 */
function addProperLandmarkRegions() {
    addMainLandmark();
    addLandmarkRolesAndFixIssues();
}

/**
 * Replaces my-button with actual button
 */
function replaceMyButton() {
    const myButton = document.getElementById('my-button');
    if (myButton) {
        const button = document.createElement('button');
        button.textContent = myButton.textContent;
        button.onclick = myButton.onclick;
        myButton.replaceWith(button);
    }
}

/**
 * Ensures dependencyGraph container has proper ARIA role
 */
function ensureDependencyGraphAriaRole() {
    const container = document.getElementById('dependencyGraph');
    if (container && !container.hasAttribute('role')) {
        container.setAttribute('role', 'region');
        container.setAttribute('aria-label', 'Dependency Graph');
    }
}

/**
 * Counts dependencies in the codebase
 * @param {string} code - The code to analyze for dependencies
 * @returns {number} The count of dependencies found
 */
function countDependencies(code) {
  const requireRegex = /require\(['"]([^'"]+)['"]\)/g;
  const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
  
  let count = 0;
  let match;
  
  // Count require() calls
  while ((match = requireRegex.exec(code)) !== null) {
    count++;
  }
  
  // Count import statements
  while ((match = importRegex.exec(code)) !== null) {
    count++;
  }
  
  return count;
}

// Export all existing and new functions
module.exports = {
    getLangAttribute,
    getFullLangAttribute,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmarkStructure,
    addLandmarkRegions,
    getSvgAccessibleName,
    setSvgAttributes,
    ensureUniqueLandmarks,
    initializeApp,
    getConfig,
    validateInput,
    processData,
    initialize,
    fetchUser,
    clearCache,
    main,
    formatDate
};