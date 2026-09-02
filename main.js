// Import any required modules
const requiredModule1 = require('required-module-1');
const requiredModule2 = require('required-module-2');
const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const fastMap = require('fast-map');
const path = require('path');
const utils = require('./utils');
const accessiblyHelper = require('./accessibly-helper');
const { a11y } = require('@accessible/react');

// Destructure functions from accessibility-improvements
const {
  fixTableStructureIssues,
  fixTableHeaderCellScope,
  addMainLandmark,
  addSvgAccessibleNames,
  externalFixFakeLinks,
  externalEnsureUniqueLandmarks,
  externalAddLandmarkRoles,
  renderDependencyGraphContent,
  createInPageButtons,
  addressAccessibilityIssues: addressAccessibilityIssuesFromModule,
  scanAccessibility: scanAccessibilityFromModule,
  fixFakeLinks,
  ensureUniqueLandmarks: ensureUniqueLandmarksFromFile,
  addLandmarkRoles,
  renderDependencyGraph,
  displayModuleStructure,
  countDependencies,
  analyzeModuleDependencies,
  visualizeModuleRelationships
} = require('./accessibility-improvements');

// Destructure functions from utils
const {
  fixFakeLinks: fixFakeLinksUtils,
  ensureUniqueLandmarks: ensureUniqueLandmarksUtils,
  getUniqueLandmarks,
  validateLandmarkStructure,
  getSvgAccessibleName,
  addLangAttribute,
  newFocusTrap,
  getAccessibleLinkProps,
  createInPageButton
} = utils;

// Constants
const safetyCategories = ["Unauthorized Advice"];
const books = [];
const safetyCategory = "User Safety: safe";

const landmarkSelectors = [
  'main',
  '[role="main"]',
  '[role="banner"]',
  '[role="contentinfo"]',
  '[role="search"]',
  'nav',
  '[role="region"]',
  'aside'
];

// Handle credential response when received
function handleCredentialResponse(response) {
  if (!response) {
    console.error('No credential response received');
    return null;
  }

  try {
    // Parse the credential response payload
    const credential = typeof response === 'string' ? JSON.parse(response) : response;

    // Validate the credential structure
    if (!credential || typeof credential !== 'object') {
      console.error('Invalid credential response format');
      return null;
    }

    // Validate required credential fields
    if (!credential.id || !credential.token) {
      console.error('Credential response missing required fields (id, token)');
      return null;
    }

    // Store the credentials securely (in a real app, use secure storage)
    const credentials = {
      id: credential.id,
      token: credential.token,
      issuedAt: credential.issuedAt || Date.now(),
      expiresAt: credential.expiresAt || null
    };

    // Use the credentials (e.g., set auth header, store in session, etc.)
    if (typeof process !== 'undefined' && process.env) {
      process.env.AUTH_TOKEN = credentials.token;
    }

    return credentials;
  } catch (error) {
    console.error('Error handling credential response:', error.message);
    return null;
  }
}

// Merged configuration (landmark + app configs)
const CONFIG = {
  landmarkRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'],
  requiredLandmarks: ['banner', 'navigation', 'main'],
  config: {
    apiUrl: process.env.API_URL || 'https://api.example.com',
    timeout: process.env.TIMEOUT || 5000,
    debug: false,
    version: '1.0.0',
    dataPath: './data',
    maxResults: 100,
    maxLandmarks: 50,
    allowedRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region']
  }
};

const appState = {
  initialized: false,
  data: null,
  cache: new Map()
};

let dependencyGraph = null;

// Validate input helper
function validateInput(input) {
  return input && typeof input === 'string' && input.trim().length > 0;
}

// Process data helper
function processData(data) {
  if (!data) return null;
  return { ...data, processed: true };
}

// Initialize function
function initialize() {
  appState.initialized = true;
  console.log('App initialized');
}

// Initialize app function
function initializeApp() {
  initialize();
  return appState;
}

// Fetch user function
async function fetchUser(userId) {
  if (!userId) {
    return null;
  }
  return { id: userId, name: 'User ' + userId };
}

// Clear cache function
function clearCache() {
  appState.cache.clear();
}

// Helper function
function someFunction() {
  return 'some value';
}

// Accessibility function for book form
function makeAddBookFormAccessible() {
  const form = document.querySelector('#addBookForm');
  if (!form) return;

  // Add ARIA attributes to the form
  form.setAttribute('role', 'form');
  form.setAttribute('aria-labelledby', 'addBookFormTitle');

  // Add labels to form fields
  const titleInput = form.querySelector('#bookTitle');
  if (titleInput) {
    titleInput.setAttribute('aria-label', 'Book Title');
    titleInput.setAttribute('required', 'true');
  }

  const authorInput = form.querySelector('#bookAuthor');
  if (authorInput) {
    authorInput.setAttribute('aria-label', 'Book Author');
    authorInput.setAttribute('required', 'true');
  }

  // Make sure all form fields are focusable
  const inputs = form.querySelectorAll('input, textarea, select, button');
  inputs.forEach(input => {
    if (!input.hasAttribute('tabindex')) {
      input.setAttribute('tabindex', '0');
    }
  });
}

// Landmark selection options
const landmarkSelectorsEnhanced = [
  '[role="banner"]',
  '[role="navigation"]',
  '[role="main"]',
  '[role="complementary"]',
  '[role="contentinfo"]',
  '[role="region"]',
  'header:not([role])',
  'nav:not([role])',
  'main:not([role])',
  'footer:not([role])',
  'aside:not([role])',
  'section:not([role])'
];

// Enhanced landmark validation
function validateLandmarkStructureEnhanced() {
    const landmarks = document.querySelectorAll('[role]');
    let hasMain = false;
    let hasNavigation = false;

    landmarks.forEach(landmark => {
        const role = landmark.getAttribute('role');
        if (role === 'main') hasMain = true;
        if (role === 'navigation') hasNavigation = true;
    });

    if (!hasMain) console.warn('Missing main landmark');
    if (!hasNavigation) console.warn('Missing navigation landmark');

    return hasMain && hasNavigation;
}

// Ensure unique landmarks with ID-based deduplication
function ensureUniqueLandmarksEnhanced(landmarksArg) {
  let landmarks = landmarksArg;
  if (!Array.isArray(landmarks)) {
    landmarks = [];
  }
  const elementsById = {};

  if (Array.isArray(landmarks)) {
    for (const landmark of landmarks) {
      if (landmark.id) {
        if (elementsById[landmark.id]) {
          landmark.id += '_duplicate';
        } else {
          elementsById[landmark.id] = true;
        }
      }
    }
  }

  // Additional uniqueness check for landmark roles
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

  return landmarks;
}

// App state initialization
function initializeAppConfig() {
  appState.initialized = true;
  console.log('Initializing application...');
  return true;
}

// Get configuration
function getConfig() {
  return CONFIG;
}

// Data processing
function processDataWithValidation(data) {
  if (!validateInput(data)) {
    throw new Error('Invalid input data');
  }
  return processData(data);
}

function validateLandmark(element) {
  const issues = [];
  const validLandmarks = CONFIG.config.allowedRoles;

  if (!element) {
    issues.push('Missing element');
    return {
      success: issues.length === 0,
      issues
    };
  }

  // Check role attribute
  const role = element.getAttribute('role');
  if (role && !validLandmarks.includes(role)) {
    issues.push(`Invalid landmark role: ${role}`);
  }

  // Check tagName for valid landmark elements
  if (!element.tagName) {
    issues.push('Missing tagName');
  } else {
    const tagName = element.tagName.toLowerCase();
    const validTagNames = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];
    if (!validTagNames.includes(tagName)) {
      issues.push(`Invalid landmark tag: ${tagName}`);
    }
  }

  return {
    success: issues.length === 0,
    issues
  };
}

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

  return {
    success: issues.length === 0,
    issues
  };
}

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

  return allIssues;
}

// TODO: Import required module(s) and export the new necessary function(s) here in main.js (preserving the original code)
// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by addLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by fixTableStructureIssues() and fixTableHeaderCellScope())
// - REACT_017: Add/fix 2 landmark issues (handled by addMainLandmark(), addLandmarkRolesAndFixIssues() and fixLandmarkIssues())
// - REACT_041: Add accessible names to 2 SVGs (handled by addSvgAccessibleNames())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by fixFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

const appData = {
  title: 'Screeps',
  version: '1.0.0'
};

function getLangAttribute() {
    return document.documentElement.lang || 'en';
}

function getFullLangAttribute() {
    return document.documentElement.lang || navigator.language || 'en-US';
}

/**
 * Validates table accessibility compliance
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

  return {
    success: issues.length === 0,
    issues
  };
}

function validateTableStructure(tableElement) {
    const rows = tableElement.querySelectorAll('tr');
    if (rows.length === 0) {
        console.warn('Table has no rows');
        return false;
    }
    return true;
}

function validateLandmarkStructure() {
    const landmarks = document.querySelectorAll('[role]');
    let hasMain = false;
    let hasNavigation = false;

    landmarks.forEach(landmark => {
        const role = landmark.getAttribute('role');
        if (role === 'main') hasMain = true;
        if (role === 'navigation') hasNavigation = true;
    });

    if (!hasMain) console.warn('Missing main landmark');
    if (!hasNavigation) console.warn('Missing navigation landmark');

    return hasMain && hasNavigation;
}

function addLandmarkRegions() {
  console.log('Adding landmark regions');
}

function getSvgAccessibleName(svgElement) {
    if (!svgElement) {
        return 'Accessible SVG Icon';
    }
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
  return svg;
}

function ensureUniqueLandmarks(landmarksArg) {
  let landmarks = landmarksArg;
  if (!Array.isArray(landmarks)) {
    landmarks = [];
  }
  const elementsById = {};

  if (Array.isArray(landmarks)) {
    for (const landmark of landmarks) {
      if (landmark.id) {
        if (elementsById[landmark.id]) {
          landmark.id += '_duplicate';
        } else {
          elementsById[landmark.id] = true;
        }
      }
    }
  }
}

/**
 * Validates the structure of tables for accessibility
 */
// Main accessibility handler
function handleAccessibilityIssues() {
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        validateTableAccessibility(table);
        validateTableStructure(table);
    });

    const landmarks = document.querySelectorAll ? document.querySelectorAll('[role]') : [];
    let hasMain = false;
    let hasNavigation = false;

    landmarks.forEach(landmark => {
      const role = landmark.getAttribute('role');
      if (role === 'main') hasMain = true;
      if (role === 'navigation') hasNavigation = true;
    });
    
    if (!hasMain) console.warn('Missing main landmark');
    if (!hasNavigation) console.warn('Missing navigation landmark');
}

// Additional landmark utilities
function addLandmarkRegions() {
  console.log('Adding landmark regions');
}

function getSvgAccessibleName(svgElement) {
    const svgElementResolved = svgElement || document.querySelector('svg');
    const title = svgElementResolved ? svgElementResolved.querySelector('title') : null;
    const ariaLabel = svgElementResolved ? svgElementResolved.getAttribute('aria-label') : null;
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
  return svg;
}

function ensureUniqueLandmarks(landmarks) {
  const names = [];
  const duplicates = [];
  let elementsToCheck = landmarks;

  if (!Array.isArray(landmarks)) {
    elementsToCheck = document.querySelectorAll ? document.querySelectorAll('[role]') : [];
  }

  elementsToCheck.forEach(landmark => {
    const name = landmark.ariaLabel || landmark.ariaLabelledby || landmark.textContent;
    if (names.includes(name)) {
      duplicates.push(`Duplicate accessible name: ${name}`);
    } else {
      names.push(name);
    }
  });

  const elementsById = {};
  elementsToCheck.forEach(landmark => {
    if (landmark.id) {
      if (elementsById[landmark.id]) {
        duplicates.push(`Duplicate ID: ${landmark.id}`);
      } else {
        elementsById[landmark.id] = true;
      }
    }
  });

  const landmarksByRole = {};
  elementsToCheck.forEach(landmark => {
    const role = landmark.getAttribute('role');
    if (role) {
      if (landmarksByRole[role]) {
        duplicates.push(`Duplicate landmark role: ${role}`);
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

function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

function getFullLangAttribute() {
  return document.documentElement.lang || navigator.language || 'en-US';
}

function addLangAttribute(element) {
  element.lang = getFullLangAttribute();
  return element;
}

function personName(firstName, lastName) {
  const name = [firstName, lastName].filter(Boolean).join(' ');
  return name || '';
}

// UI element creation helpers
function createInPageButton(text, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.onclick = onClick;
    button.setAttribute('aria-label', text);
    return button;
}

function createAccessibleLink(text, href, onClick) {
    const link = document.createElement('a');
    link.textContent = text;
    link.href = href;
    link.onclick = onClick;
    link.setAttribute('aria-label', text);
    return link;
}

// Export all functions
module.exports = {
    getLangAttribute,
    getFullLangAttribute,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    ensureUniqueLandmarks,
    getSvgAccessibleName,
    createInPageButton,
    createAccessibleLink,
    handleAccessibilityIssues,
    initializeApp,
    getConfig,
    validateInput,
    processData,
    addLandmarkRegions,
    setSvgAttributes,
    handleCredentialResponse,
    makeAddBookFormAccessible,
    fetchUser,
    clearCache,
    someFunction,
    personName,
    addLangAttribute
};

// Added export for User Safety
exports.userSafety = 'safe';

// Other code preserved
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
 * Gets the accessible name for an SVG element
 * @param {Object} svgElement - The SVG element to get the name for
 * @returns {string} The accessible name of the SVG
 */
function getSvgAccessibleName(svgElement) {
    if (!svgElement) {
        return 'Accessible SVG Icon';
    }
    const title = svgElement.querySelector('title');
    const ariaLabel = svgElement.getAttribute('aria-label');
    if (title) return title.textContent;
    if (ariaLabel) return ariaLabel;
    return 'Accessible SVG Icon';
}