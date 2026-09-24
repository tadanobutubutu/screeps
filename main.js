import './styles.css';
import { initializeApp } from './app.js';
import { registerSW } from 'effector-sw';
import { setLanguageAttribute, addLandmarkRoles, fixFakeLinks, isSecureContext, wrapPrimaryContentInMain, initializeApp as initApp, landmarks, appData, icons, validateLandmark, ensureFocusableElements, renderDependencyGraphContent, ensureLandmarkUniqueness, validateSvgAccessibility, processUniqueElements, addressInsightIssues, renderDependencyGraph, renderIndexView, calculateSum, addProperLandmarkRegions, countDependencies, getLangAttribute, getUniqueLandmarks, getSvgAccessibleName, validateTableAccessibility, validateTableStructure, validateLandmarkStructure, getSvgAccessibleName as getSvgAccessibleName2, validateUniqueLandmarks, createInPageButton, primaryContent } from './somemodule';

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
  ensureUniqueLandmarks: ensureUniqueLandmarksFromUtils,
  addProperLandmarkRegions,
  validateLinkAccessibility: validateLinkAccessibilityFromUtils,
  handleFakeLinks: handleFakeLinksFromUtils,
  someFunction: someFunctionLocal,
  fetchUser: fetchUserLocal,
  clearCache: clearCacheLocal,
  addSvgAccessibilityProps,
  getAccessibleLinkProps,
  landmarkStructureCheck,
} = require('./utils');

const {
  sortByTitle: sortByTitleLocal,
  sortByAuthor: sortByAuthorLocal,
  validateLandmarkObject,
  getLangAttribute: getLangAttributeLocal,
  createInPageButton: createInPageButtonLocal,
  validateTableAccessibility: validateTableAccessibilityLocal,
  validateLandmarkStructure: validateLandmarkStructureLocal,
  getSvgAccessibleName: getSvgAccessibleNameLocal,
  setSvgAttributes,
  ensureUniqueLandmarks: ensureUniqueLandmarksLocal2,
  someFunction: someFunctionLocal2,
  fetchUser: fetchUserLocal2,
  clearCache: clearCacheLocal2,
  addSvgAccessibilityProps: addSvgAccessibilityPropsLocal,
  getAccessibleLinkProps: getAccessibleLinkPropsLocal,
  landmarkStructureCheck: landmarkStructureCheckLocal,
} = require('./somemodule');

// TODO: This is the existing code that needs to be preserved
// _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
// <!-- todo-hash: 2be288e6871a7369e84e30193fd1601b6ff1e34c -->
// _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
// <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
// _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
// <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->

const config = {
  name: 'MyApp',
  version: '1.0.0',
  debug: false,
  dataPath: './data',
  maxResults: 100,
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: 5000
};

const landmarkSelectors = [
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

const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'];

let isInitialized = false;
let dependencyGraph = null;

const appState = {
  initialized: false,
  data: null,
  cache: new Map()
};

// TODO: Address accessibility issues from insight report — CONTINUING in main.js

function validateLandmark(landmark) {
  const issues = [];
  const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];

const books = [];
const safetyCategory = "User Safety: safe";

// Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role
function ensureDependencyGraphAriaRole() {
  const dependencyGraphEl = document.querySelector('#dependencyGraph');
  if (dependencyGraphEl) {
    dependencyGraphEl.setAttribute('role', 'region');
  }
}

// Address accessibility issues from insight report:
// Ensure each landmark has an ID and add appropriate aria-label
function ensureUniqueLandmarks(landmarksArray) {
  if (!landmarksArray || landmarksArray.length === 0) {
      return [];
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
function validateLandmarkElement(element) {
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
      const result = validateLandmarkElement(landmark);
      if (!result.success) {
        issues.push({
          landmarkIndex: index,
          issues: result.issues
        });
      }
      return null;
  }).filter(Boolean);
}

// Combine sortByTitle, sortByTitleLocal, and sortByAuthor, sortByAuthorLocal
const sortByTitle = sortByTitleLocal || sortByTitle;
const sortByAuthor = sortByAuthorLocal || sortByAuthor;

// Application initializations

export const validateLandmark = (landmark) => {
  const errors = [];

  // Validation logic

  return {
    valid: errors.length === 0,
    errors
  };
};

export const checkLinkAccessibility = (url) => {
  // Implementation logic here...
  return true;
};

export const newExportedFunction = () => {
  // New export logic here...
};

// Ensure accessibility attributes are set when adding a book
ensureAccessibilityAttributesForAddBook();

// Find the primary content element in the DOM
let primaryContent = document.querySelector('.primary-content') ||
                        document.querySelector('[role="main"]') ||
                        document.getElementById('main-content') ||
                        document.querySelector('#content');

// Function to wrap primary content in a <main> element
function wrapPrimaryContentInMain() {
  // If primary content exists and is not already inside a <main> element
  if (primaryContent && !primaryContent.closest('main')) {
      // Create a new <main> element
      const mainElement = document.createElement('main');

      // Insert the <main> element before the primary content in the DOM
      primaryContent.parentNode.insertBefore(mainElement, primaryContent);

      // Move the primary content inside the <main> element
      mainElement.appendChild(primaryContent);

      return mainElement;
  }
  return null;
}

function getUniqueLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    const elements = Array.from(document.querySelectorAll(landmarkSelectors.join(',')));
    const landmarkIds = elements.map(el => el.id || el.getAttribute('aria-labelledby'));
    const uniqueIds = new Set(landmarkIds);

    elements.forEach((element, index) => {
      if (!element.id) {
        element.id = `landmark-${index}`;
      }
    });
    return elements;
  }

  const seen = new Set();
  const uniqueLandmarks = [];

  for (const landmark of landmarks) {
    if (!landmark || typeof landmark.id === 'undefined') {
      continue;
    }

    const landmarkId = typeof landmark.id === 'string' ? landmark.id : String(landmark.id);

    if (!seen.has(landmarkId)) {
      seen.add(landmarkId);
      uniqueLandmarks.push(landmark);
    }
  }

  return uniqueLandmarks;
}

// NEW: Implement a new function to handle focus trap for keyboard navigation
function newFocusTrap(containerElement, options = {}) {
  let previouslyFocusedElement = null;
  let focusableElements = [];
  let firstFocusableElement = null;
  let lastFocusableElement = null;
  let trapActivate = null;

  const getFocusableElements = (container) => {
    const focusableSelectors = [
      'a[href]',
      'area[href]',
      'input:not([disabled]):not([type="hidden"])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'button:not([disabled])',
      'iframe',
      'object',
      'embed',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable]'
    ].join(',');

    return Array.from(container.querySelectorAll(focusableSelectors))
      .filter(el => el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length);
  };

  const updateFocusableElements = () => {
    focusableElements = getFocusableElements(containerElement);
    firstFocusableElement = focusableElements[0];
    lastFocusableElement = focusableElements[focusableElements.length - 1];
  };

  const activate = () => {
    previouslyFocusedElement = document.activeElement;
    updateFocusableElements();

    if (firstFocusableElement) {
      firstFocusableElement.focus();
    }

    trapActivate = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) { // shift + tab
          if (document.activeElement === firstFocusableElement) {
            e.preventDefault();
            lastFocusableElement.focus();
          }
        } else { // tab
          if (document.activeElement === lastFocusableElement) {
            e.preventDefault();
            firstFocusableElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', trapActivate);
  };

  const deactivate = () => {
    document.removeEventListener('keydown', trapActivate);
    if (previouslyFocusedElement) {
      previouslyFocusedElement.focus();
    }
    previouslyFocusedElement = null;
  };

  return {
    activate,
    deactivate
  };
}

/**
 * Function to address accessibility issues from insight report.
 * Handles various accessibility issues including language attributes,
 * table structures, landmarks, SVG accessibility, fake links, and landmark regions.
 */
function addressInsightIssues() {
  // REACT_015: Add lang attribute to HTML element
  const htmlElement = document.documentElement;
  if (htmlElement && !htmlElement.lang) {
    const langAttribute = getLangAttribute();
    if (langAttribute) {
      htmlElement.setAttribute('lang', langAttribute);
    }
  }

  // REACT_027: Fix table structure issues
  validateTableAccessibility();
  validateTableStructure();

  const landmarks = document.querySelectorAll('[role]');
  landmarks.forEach(landmark => {
    validateLandmarkElement(landmark);
  });

  // REACT_041: Add accessible names to SVGs
  getSvgAccessibleName();
  setSvgAttributes();

  // REACT_025: Ensure unique landmarks (already handled by ensureUniqueLandmarks)

  // REACT_036: Fix fake link issue
  handleFakeLinks();

  // REACT_037: Add proper landmark regions
  addProperLandmarkRegions();
}

function getSvgAccessibleName(svgElement) {
  if (!svgElement) return '';

  const title = svgElement.querySelector('title');
  if (title) {
    return title.textContent;
  }

  const desc = svgElement.querySelector('desc');
  if (desc) {
    return desc.textContent;
  }

  return svgElement.getAttribute('aria-label') || '';
}

function validateTableAccessibility(tableElement) {
  if (!tableElement) return false;

  const headers = tableElement.querySelectorAll('th');
  const cells = tableElement.querySelectorAll('td, th');

  for (const cell of cells) {
    if (!cell.id && !cell.getAttribute('scope')) {
      return false;
    }
  }

  return true;
}

/**
 * Adds language attribute to HTML element
 * @param {string} lang - The language code to set
 * @returns {boolean} Success status
 */
function addLangAttribute(lang) {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang;
    return true;
  }
  return false;
}

/**
 * Fixes table structure issues
 * @param {Object} table - The table element to fix
 * @returns {Object} Result with success status and any issues found
 */
function fixTableStructure(table) {
  const issues = [];

  if (!table) {
    return { success: false, issues: ['No table provided'] };
  }

  // Add caption if missing
  if (!table.querySelector('caption')) {
    const caption = document.createElement('caption');
    caption.textContent = 'Table caption';
    table.insertBefore(caption, table.firstChild);
  }

  // Add scope attributes to header cells
  const headerCells = table.querySelectorAll('th');
  headerCells.forEach(cell => {
    if (!cell.hasAttribute('scope')) {
      cell.setAttribute('scope', 'col');
    }
  });

  return { success: true, issues };
}

/**
 * Handles the credential response from an authentication flow
 * @param {Object} credentialResponse - The response object from credential provider
 * @returns {Object} Result with success status and parsed credential data
 */
function handleCredentialResponse(credentialResponse) {
  const issues = [];

  const rows = tableElement.querySelectorAll('tr');
  let hasHeader = false;

  for (const row of rows) {
    const cells = row.querySelectorAll('th, td');
    for (const cell of cells) {
      if (cell.tagName.toLowerCase() === 'th') {
        hasHeader = true;
        if (!cell.getAttribute('scope')) {
          return false;
        }
      }
    }
  }

  return hasHeader;
}

async function scanAccessibility() {
  const violations = [];

  if (typeof document !== 'undefined') {
    const results = await axe.run(document);
    violations.push(...results.violations);
  }

  return { violations };
}

function validateLinkAccessibility() {
  const links = document.querySelectorAll('a[href]');

  for (const link of links) {
    if (!link.textContent.trim()) {
      return false;
    }
  }

  return true;
}

function handleFakeLinks() {
  const fakeLinks = document.querySelectorAll('.fake-link');
  fakeLinks.forEach(link => {
    if (link.tagName === 'A' && !link.getAttribute('role')) {
      link.setAttribute('role', 'button');
    }
  });
}

function validateLandmark() {
  const landmarks = document.querySelectorAll(landmarkSelectors.join(','));
  return landmarks.length > 0;
}

function validateLandmarkStructure() {
  const landmarks = document.querySelectorAll(landmarkSelectors.join(','));

  for (const landmark of landmarks) {
    if (!landmark.id && !landmark.getAttribute('aria-label') && !landmark.getAttribute('aria-labelledby')) {
      return false;
    }
  }

  return true;
}

function initialize() {
  console.log('Initializing application...');

  if (!isInitialized) {
    isInitialized = true;
    appState.initialized = true;

    const appData = {
      title: 'Screeps',
      version: CONFIG.version
    };

    /**
     * Address accessibility issues from insight report:
     * - REACT_015: Add lang attribute to HTML element (handled by addLangAttribute() and wrapPrimaryContentInMain())
     * - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
     * - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and addFixLandmarkIssues())
     * - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
     * - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and addFixLandmarkIssues())
     * - REACT_036: Fix 1 fake link issue (handled by fixFakeLinkIssues(), createAccessibleLink() and addFixLandmarkIssues())
     * todo-hash: 50090d29914857ebc4d3d6f532d1293acbb65526
     */

    addLangAttribute();
    wrapPrimaryContentInMain();
    fixTableStructureIssues();
    fixTableHeaderCellScope();
    addMainLandmark();
    addSvgAccessibleNames();
    fixFakeLinkIssues();
    ensureUniqueLandmarks();

    // Load landmarks for accessibility processing
    const landmarks = loadLandmarks();
    const processed = processLandmarks(landmarks);

    // Ensure the dependencyGraph container has a proper ARIA role
    if (dependencyGraph) {
      if (!dependencyGraph.id) {
        dependencyGraph.id = 'dependencyGraph';
      }
      if (!dependencyGraph.hasAttribute('role')) {
        dependencyGraph.setAttribute('role', 'region');
      }
      if (!dependencyGraph.hasAttribute('aria-label')) {
        dependencyGraph.setAttribute('aria-label', 'Dependency Graph Visualization');
      }
    }
  }
}

function loadLandmarks() {
  try {
    const filePath = path.join(__dirname, CONFIG.dataPath, 'landmarks.json');
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading landmarks:', error.message);
    return [];
  }
}

function processLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
  }

  const validLandmarks = landmarks.filter(isValidLandmark);
  const uniqueLandmarks = ensureUniqueLandmarks(validLandmarks);

  return uniqueLandmarks.slice(0, CONFIG.maxResults);
}

function ensureUniqueLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
  }
  const seen = new Set();
  return landmarks.filter(landmark => {
    if (!seen.has(landmark.id)) {
      seen.add(landmark.id);
      return true;
    }
    return false;
  });
}

function countDependencies(dependencies) {
  if (!Array.isArray(dependencies)) {
    return 0;
  }
  return dependencies.length;
}

// Dependency Visualization Tool Functions
function analyzeModuleDependencies(modules) {
  // Implementation would analyze and return dependency relationships
  console.log('Analyzing dependencies for modules:', modules);
  return {
    totalDependencies: 0,
    dependencyMap: {}
  };
}

function visualizeModuleRelationships(modules) {
  // Implementation would create a visual representation of module relationships
  console.log('Visualizing relationships for modules:', modules);
  return {
    graph: {},
    nodes: [],
    edges: []
  };
}

// Initialize all accessibility fixes
function initializeAccessibility() {
  ensureLangAttribute();
  fixLandmarks();
  addSvgAccessibleNames();
  fixFakeLinks();
  replaceButtonIds();
  ensureDependencyGraphAriaRole();
  // Removed undefined newFunction() call
}

// Run on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAccessibility);
  } else {
    initializeAccessibility();
  }
}

function processLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
  }

  const validLandmarks = landmarks.filter(isValidLandmark);
  const uniqueLandmarks = ensureUniqueLandmarks(validLandmarks);

  return uniqueLandmarks.slice(0, CONFIG.maxResults);
}

function ensureUniqueLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
  }
  const seen = new Set();
  return landmarks.filter(landmark => {
    if (seen.has(`${landmark.id || ''}${landmark.name || ''}`)) {
      return false;
    }
    seen.add(`${landmark.id || ''}${landmark.name || ''}`);
    return true;
  });
}

function checkLandmarkElement(id) {
  const element = document.getElementById(id);
  return element !== null;
}

function validateLandmarkObject(landmark) {
  const errors = [];

  if (!landmark) {
    errors.push('Landmark is required');
    return { valid: false, errors };
  }

  if (!landmark.name || typeof landmark.name !== 'string' || landmark.name.trim() === '') {
    errors.push('Landmark must have a valid name');
  }

  if (landmark.latitude === undefined || landmark.latitude === null) {
    errors.push('Landmark must have a latitude');
  } else if (typeof landmark.latitude !== 'number' || isNaN(landmark.latitude)) {
    errors.push('Landmark latitude must be a number');
  } else if (landmark.latitude < -90 || landmark.latitude > 90) {
    errors.push('Landmark latitude must be between -90 and 90');
  }

  if (landmark.longitude === undefined || landmark.longitude === null) {
    errors.push('Landmark must have a longitude');
  } else if (typeof landmark.longitude !== 'number' || isNaN(landmark.longitude)) {
    errors.push('Landmark longitude must be a number');
  } else if (landmark.longitude < -180 || landmark.longitude > 180) {
    errors.push('Landmark longitude must be between -180 and 180');
  }

  if (Array.isArray(landmark)) {
    landmark.forEach((innerLandmark, index) => {
      if (!innerLandmark.name || typeof innerLandmark.name !== 'string' || innerLandmark.name.trim() === '') {
        errors.push(`Landmark at index ${index} must have a valid name`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

function addSvgAccessibilityProps(svgElement, label, labelledById) {
  if (!svgElement) return;

  const props = getSvgAccessibilityProps(label, labelledById);

  Object.keys(props).forEach(prop => {
    svgElement.setAttribute(prop, props[prop]);
  });
}

function getSvgAccessibilityProps(label, labelledById) {
  const props = {};
  if (label) {
    props['aria-label'] = label;
  }
  if (labelledById) {
    props['aria-labelledby'] = labelledById;
  }
  return props;
}

function getAccessibleLinkProps(href, label) {
  return {
    href,
    'aria-label': label,
    role: 'link'
  };
}

// Function to add proper landmark regions
function addProperLandmarkRegions() {
  // Implementation for adding proper landmark regions
  const mainLandmarks = document.querySelectorAll('main');
  mainLandmarks.forEach(landmark => {
    if (!landmark.hasAttribute('role')) {
      landmark.setAttribute('role', 'main');
    }
  });
}

// Export all existing and new functions
module.exports = {
    getLangAttribute,
    getFullLangAttribute,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkElement,
    validateLandmarkStructure,
    ensureUniqueLandmarks,
    getSvgAccessibleName,
    createInPageButton,
    createAccessibleLink,
    handleAccessibilityIssues,
    addSvgAccessibilityProps,
    addLangAttribute,
    fixTableStructure,
    addMainLandmark,
    setSvgAttributes,
    initializeApp,
    getConfig,
    validateInput,
    processData,
    addLandmarkRegions,
    handleCredentialResponse,
    validateCredentialToken,
    processCredentialAuthentication,
    upgradeSystem
};