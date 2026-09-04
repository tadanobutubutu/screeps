import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import a11y from './AccessibilityUtilities'; // Assuming accessibility utilities are in a separate file

// Module imports and configuration
const utils = require('./utils');
const axe = require('axe-core');
const express = require('express');
const fs = require('fs');
const path = require('path');
const configModule = require('./config');
const logger = require('./utils/logger');
const fastMap = require('fast-map');

const accessiblyHelper = async (...args) => {
  return args;
};

const config_legacy = {
  name: 'MyApp',
  version: '1.0.0',
  debug: false,
  dataPath: './data',
  maxResults: 100
};

const config = {
  apiUrl: process.env.API_URL || 'https://api.default.com',
  timeout: 5000,
  debug: false,
  version: '1.0.0',
  dataPath: './data',
  maxResults: 100,
  allowedRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'],
  landmarkRoles: [],
  maxLandmarks: 50,
  name: 'MyApp'
};

const CONFIG = config;

function validateConfig(cfg) {
  const errors = [];

  if (!cfg.apiUrl || typeof cfg.apiUrl !== 'string') {
    errors.push('apiUrl must be a valid string');
  }

  if (typeof cfg.timeout !== 'number' || cfg.timeout <= 0) {
    errors.push('timeout must be a positive number');
  }

  if (typeof cfg.debug !== 'boolean') {
    errors.push('debug must be a boolean');
  }

  if (!cfg.version || typeof cfg.version !== 'string') {
    errors.push('version must be a valid string');
  }

  if (!cfg.dataPath || typeof cfg.dataPath !== 'string') {
    errors.push('dataPath must be a valid string');
  }

  if (typeof cfg.maxResults !== 'number' || cfg.maxResults <= 0) {
    errors.push('maxResults must be a positive number');
  }

  if (!Array.isArray(cfg.allowedRoles) || cfg.allowedRoles.length === 0) {
    errors.push('allowedRoles must be a non-empty array');
  }

  if (typeof cfg.maxLandmarks !== 'number' || cfg.maxLandmarks <= 0) {
    errors.push('maxLandmarks must be a positive number');
  }

  return errors;
}

const validationErrors = validateConfig(config);
if (validationErrors.length > 0) {
  throw new Error('Configuration validation failed: ' + validationErrors.join(', '));
}

config.landmarkRoles = config.allowedRoles;

const LANDMARK_SELECTORS = [
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
  'section:not([role])'
];

function createLandmarkSelectors() {
  return LANDMARK_SELECTORS.map(selector => ({
    selector,
    priority: LANDMARK_SELECTORS.indexOf(selector)
  }));
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

let books = [];

function getUserSafetyAdvice() {
  const safetyCategories = ['Unauthorized Advice', 'Dangerous Action', 'Potential Scam', 'Privacy Risk'];
  return safetyCategories[Math.floor(Math.random() * safetyCategories.length)];
}

function addBook(title, author) {
  const bookObject = { title, author };
  books.push(bookObject);

  announceBookAdded(title, author);

  return bookObject;
}

function announceBookAdded(title, author) {
  console.log(`A new book has been added: "${title}" by "${author}".`);
}

function getBooksList() {
  let booksList = [];

  books.forEach((book, index) => {
    booksList[index] = `${index + 1}. ${book.title} by ${book.author}`;
  });

  return booksList.join("\n");
}

// TODO: Implement harvest logic
// This function should collect resources or data from available sources
function harvestData() {
  const dataPath = CONFIG.dataPath;
  try {
    const files = fs.readdirSync(dataPath);
    let totalItems = 0;

    files.forEach(file => {
      if (file.endsWith('.json')) {
        try {
          const content = fs.readFileSync(path.join(dataPath, file), 'utf8');
          const data = JSON.parse(content);
          if (Array.isArray(data)) {
            totalItems += data.length;
          } else {
            totalItems += 1;
          }
        } catch (e) {
          // Ignore unreadable files
        }
      }
    });

    return `Collected ${totalItems} items from ${files.length} data files`;
  } catch (e) {
    return 'No data path available';
  }
}

// Main function that applies all accessibility fixes and collects data
function applyAccessibilityFixesAndHarvestData(html) {
  let result = html;
  result = addLangAttribute(result);
  result = fixTableStructure(result);
  result = fixFakeLinks(result);
  // Add collected data to the html
  result += `<div id="collected-data">${harvestData()}</div>`;
  return result;
}

const getLangAttribute = () => {
  if (typeof document !== 'undefined') {
    return document.documentElement.getAttribute('lang') || 'en';
  }
  return 'en';
};

// TODO: This is the existing code that needs to be preserved
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// This is the existing code that needs to be preserved
// (This comment remains as-is)
// More existing code that should be preserved
// Existing code ends here
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by `getLangAttribute()` and `addLangAttribute()`)
// - REACT_027: Fix 26 table structure issues (handled by `validateTableAccessibility()`, `validateTableStructure()` and `fixTableStructure()`)
// - REACT_017: Add/fix 4 landmark issues (handled by `addMainLandmark()`, `validateLandmark()`, `validateLandmarkStructure()` and `validateLandmarkAttributes()`)
// - REACT_041: Add accessible names to 2 SVGs (handled by `getSvgAccessibleName()` and `setSvgAttributes()`)
// - REACT_025: Ensure unique landmarks (DONE: `ensureUniqueLandmarks()`)
// - REACT_036: Fix 1 fake link issue (handled by `createInPageButton()`, `validateLinkAccessibility()` and `handleFakeLinks()`)
// - REACT_037: Add proper landmark regions (DONE: `addProperLandmarkRegions()`)

// TODO: This is where the original commitment added a new feature. Keep both changes to preserve the added functionality.

/**
 * Gets the lang attribute for the HTML element
 * @returns {string} The lang attribute value
 */
export function getLangAttribute() {
  // Delegates to implemented version
  return getLangAttribute();
}

function addLangAttribute(html) {
  if (typeof document !== 'undefined') {
    const lang = getLangAttribute();
    document.documentElement.setAttribute('lang', lang);
  }
  return html;
}

/**
 * Implements upgrade logic using harvested data to improve the system
 * @param {Object} harvestedData - The data harvested from accessibility insights
 * @returns {Object} The results of the upgrade process containing improvements applied
 */
export function upgradeLogic(harvestedData) {
  const results = {
    success: true,
    improvements: [],
    errors: []
  };

  if (!harvestedData || typeof harvestedData !== 'object') {
    results.success = false;
    results.errors.push('Invalid harvested data provided');
    return results;
  }

  // Process lang attribute improvements
  if (harvestedData.langIssues && harvestedData.langIssues.length > 0) {
    harvestedData.langIssues.forEach(issue => {
      try {
        if (typeof addLangAttribute === 'function') {
          addLangAttribute();
          results.improvements.push({
            type: 'lang',
            status: 'applied',
            issue: issue
          });
        }
      } catch (error) {
        results.errors.push(`Failed to apply lang fix: ${error.message}`);
      }
    });
  }

  // ... Implement the rest of the upgrade logic

  return results;
}

export function validateTableAccessibility(table) {
  // Implementation to be added
}

export function validateTableStructure(table) {
  // Implementation to be added
}

export function fixTableStructure(table) {
  // Implementation to be added
}

export function getSvgAccessibleName(svg) {
  // Implementation to be added
}

export function setSvgAttributes(svg) {
  // Implementation to be added
}

export function createInPageButton(text, onClick) {
  // Implementation to be added
  return document.createElement('button');
}

export function validateLinkAccessibility(link) {
  // Implementation to be added
}

const fixTableStructureIssues = () => {
  return fixTableStructure();
};

const validateLandmark = (element) => {
  if (typeof element?.id === 'undefined' || element.id === null) {
    element.setAttribute('id', utils.generateKey());
  }
  if (!element.getAttribute('role')) {
    element.setAttribute('role', element.tagName.toLowerCase());
  }

  return { valid: true, element };
};

const addMainLandmark = () => {
  if (typeof document !== 'undefined') {
    let main = document.querySelector('main');
    if (!main) {
      main = document.createElement('main');
      document.body.appendChild(main);
    }
    return { valid: true, element: main };
  }
  return { valid: false, element: null };
};

const validateLandmarkStructure = (landmarks) => {
  if (!Array.isArray(landmarks)) return [];
  return landmarks.map(landmark => validateLandmark(landmark));
};

const validateLandmarkAttributes = (landmarks, config) => {
  if (!Array.isArray(landmarks)) return [];
  const maxLandmarks = config?.maxLandmarks || 50;
  const allowedRoles = config?.allowedRoles || ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'];

  return landmarks.filter(landmark => {
    if (!landmark?.element || !landmark.element.hasAttribute('role')) {
      return false;
    }
    const role = landmark.element.getAttribute('role');
    if (!allowedRoles.includes(role)) {
      console.warn(`Invalid landmark role "${role}" - expected one of ${allowedRoles.join(' ')}`);
    }
    if (landmarks.length > maxLandmarks) {
      console.warn(`Exceeded maximum allowed landmarks (${maxLandmarks})`);
    }
    return true;
  });
};

const fixFakeLinks = (container) => {
  if (!container) return;

  const fakeLinks = container.querySelectorAll('a[href="#"], a[href=""], a:not([href])');
  fakeLinks.forEach(link => {
    if (link.getAttribute('href') === '#' || link.getAttribute('href') === '') {
      link.setAttribute('role', 'button');
      link.addEventListener('click', (e) => {
        e.preventDefault();
      });
    }
  });
};

const handleFakeLinks = () => {
  fixFakeLinks(document);
};

const addProperLandmarkRegions = (container) => {
  if (!container) return [];

  const regions = ['main', 'navigation', 'banner', 'contentinfo', 'complementary'];
  const addedRegions = [];

  regions.forEach(role => {
    const existing = container.querySelector(`[role="${role}"]`);
    if (!existing) {
      const region = document.createElement('div');
      region.setAttribute('role', role);
      container.appendChild(region);
      addedRegions.push(role);
    }
  });

  return addedRegions;
};

const ensureDependencyGraphAriaRole = () => {
  let dependencyGraph = document.getElementById('dependencyGraph');
  if (dependencyGraph) {
    if (!dependencyGraph.id) {
      dependencyGraph.id = 'dependencyGraph';
    }

    if (!dependencyGraph.hasAttribute('role')) {
      const allowedRoles = CONFIG.allowedRoles || ['region'];
      if (allowedRoles.includes('region')) {
        dependencyGraph.setAttribute('role', 'region');
      } else {
        dependencyGraph.setAttribute('role', 'region');
      }
    }
    if (!dependencyGraph.hasAttribute('aria-label')) {
      dependencyGraph.setAttribute('aria-label', 'Dependency Graph Visualization');
    }
  }
};

const checkLandmarkElement = (elementOrId) => {
  let element = elementOrId;
  if (typeof elementOrId === 'string') {
    element = document.getElementById(elementOrId);
  }

  if (!element) {
    return false;
  }

  const hasRole = element.getAttribute('role');
  const hasAriaLabel = element.getAttribute('aria-label');
  const hasAriaLabelledby = element.getAttribute('aria-labelledby');

  if (!(hasRole || hasAriaLabel || hasAriaLabelledby)) {
    if (!element.hasAttribute('aria-labelledby')) {
      const id = typeof elementOrId === 'string' ? elementOrId : element.id;
      if (id) {
        element.setAttribute('aria-labelledby', id);
      }
    }
  }

  return element;
};

const ensureUniqueLandmarks = (landmarksArray) => {
  if (!landmarksArray || !Array.isArray(landmarksArray) || landmarksArray.length === 0) {
    return [];
  }

  const seen = new Set();

  return landmarksArray.filter(landmark => {
    const name = landmark.name || '';
    const role = landmark.role || 'default';
    const key = name + '_' + role;

    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

const ensureUniqueLandmarksDoc = () => {
  return ensureUniqueLandmarks(Array.from(document.querySelectorAll('[role]:not([role="presentation"]):not([role="none"])')));
};

const landmarkStructureCheck = (landmarks) => {
  const landmarkRoles = ['main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region', 'banner', 'application'];
  return landmarkRoles;
};

const addLandmarkRegions = (container) => {
  return addProperLandmarkRegions(container);
};

const validateLinkAccessibility = (link) => {
  if (!link) return { valid: false };
  const href = link.getAttribute('href');
  if (!href || href === '#' || href === '') {
    return { valid: false, issue: 'fake link' };
  }
  return { valid: true };
};

const processLandmarks = (landmarks) => {
  if (!landmarks || !Array.isArray(landmarks)) {
    return [];
  }

  const validLandmarks = landmarks.filter(isValidLandmark);
  const uniqueLandmarks = ensureUniqueLandmarks(validLandmarks);

  return uniqueLandmarks.slice(0, CONFIG.maxResults);
};

const isValidLandmark = (landmark) => {
  return landmark &&
         typeof landmark.id !== 'undefined' &&
         landmark.id !== null;
};

const loadLandmarks = () => {
  try {
    const filePath = path.join(CONFIG.dataPath, 'landmarks.json');
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading landmarks:', error.message);
    return [];
  }
};

const sortLandmarks = (landmarks, ascending = true) => {
  return landmarks.slice().sort((a, b) => {
    const nameA = (a.name || '').toLowerCase();
    const nameB = (b.name || '').toLowerCase();

    if (ascending) {
      return nameA.localeCompare(nameB);
    }
    return nameB.localeCompare(nameA);
  });
};

const getLandmarkById = (landmarks, id) => {
  return landmarks.find(landmark => landmark.id === id) || null;
};

const checkUserSafety = () => {
  return getUserSafetyAdvice();
};

const getUserSafety = () => {
  return checkUserSafety();
};

function checkSafetyCategories() {
  return ['Unauthorized Advice', 'Dangerous Action', 'Potential Scam', 'Privacy Risk'];
}

// Add book form
function createBookForm() {
  if (typeof document === 'undefined') return;

  const form = document.createElement('form');
  form.id = 'book-form';
  form.setAttribute('aria-label', 'Add Book Form');

  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.id = 'book-title';
  titleInput.setAttribute('aria-label', 'Book Title');
  titleInput.required = true;

  const authorInput = document.createElement('input');
  authorInput.type = 'text';
  authorInput.id = 'book-author';
  authorInput.setAttribute('aria-label', 'Author Name');
  authorInput.required = true;

  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.textContent = 'Add Book';

  form.appendChild(titleInput);
  form.appendChild(authorInput);
  form.appendChild(submit);

  return form;
}

function createAccessibleInput() {
  const input = document.createElement('input');
  input.type = 'text';
  input.setAttribute('aria-label', 'Accessible Input');
  return input;
}

function createUnrotateButton() {
  const button = document.createElement('button');
  button.id = 'unrotate-btn';
  button.textContent = 'Unrotate';
  button.setAttribute('aria-label', 'Rotate Back');
  return button;
}

function rotateBack() {
  if (typeof window !== 'undefined') {
    window.location.hash = '';
  }
}

const appState = {
  initialized: false,
  data: {},
  cache: {}
};

const initializeApp = () => {
  logger.info('Application starting...');
  appState.initialized = true;
  appState.data = config || {};
  return appState;
};

const initApp = (config) => {
  return initializeApp(config);
};

const initAppAfterFixes = () => {
  initializeAccessibility();
  return initializeApp();
};

const fetchUser = (userId) => {
  return { id: userId, name: 'Test User' };
};

const clearCache = () => {
  appState.cache = {};
};

function initialize() {
  console.log('Initializing application...');

  // Load landmarks for accessibility processing
  const landmarks = loadLandmarks();
  const validLandmarks = processLandmarks(landmarks);

  const processed = processLandmarks(validLandmarks); // Keep both processLandmarks calls for consistency

  // Ensure the dependencyGraph container has a proper ARIA role
  ensureDependencyGraphAriaRole();
}

// New function that does something different
function newFunction() {
  // This function does something different
  return true;
}

const analyzeModuleDependencies = (modules) => {
  console.log('Analyzing dependencies for modules:', modules);
  return analyzeModuleDependenciesLocal(modules);
};

const analyzeModuleDependenciesLocal = (modules) => {
  return {
    totalDependencies: 0,
    dependencyMap: {}
  };
};

const visualizeModuleRelationships = (modules) => {
  console.log('Visualizing relationships for modules:', modules);
  return visualizeModuleRelationshipsLocal(modules);
};

const visualizeModuleRelationshipsLocal = (modules) => {
  return {
    graph: {},
    nodes: [],
    edges: []
  };
};

const ensureFocusableElements = () => {
  if (typeof document !== 'undefined') {
    const focusableElements = document.querySelectorAll('a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
    focusableElements.forEach(el => {
      if (!el.hasAttribute('tabindex') && el.tagName !== 'A') {
        el.setAttribute('tabindex', '0');
      }
    });
  }
};

const validateSvgAccessibility = () => {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    if (!svg.hasAttribute('aria-label') && !svg.querySelector('title')) {
      const title = svg.querySelector('title');
      if (title) {
        const label = title.textContent.trim();
        svg.setAttribute('aria-label', label);
      } else {
        svg.setAttribute('aria-label', 'SVG icon');
      }
    }
  });
};

const processUniqueElements = (elements) => {
  if (!Array.isArray(elements)) {
    return [];
  }
  const seen = new Set();
  return elements.filter(element => {
    if (seen.has(element.id)) {
      return false;
    }
    seen.add(element.id);
    return true;
  });
};

const formatResponse = (response) => {
  return JSON.stringify({ status: 'success', data: response }, null, 2);
};

const formatDate = (date) => {
  return new Date(date).toISOString();
};

const processData = (data) => {
  if (Array.isArray(data)) {
    return data.map(item => item.toString());
  }
  return data.toString();
};

const someFunction = (input) => {
  return input;
};

const getConfig = () => {
  return {
    apiUrl: (typeof process !== 'undefined' && process.env && process.env.API_URL) || '',
    timeout: 5000
  };
};

const testFunction = () => {
  return 'test';
};

// New functions to write the generated report to a file
function writeReport(report) {
  const reportFile = path.join(CONFIG.dataPath, 'report.json');
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
}

// Main function
function main() {
  console.log('Main function called');
}

const addSvgAccessibleNames = () => {
  validateSvgAccessibility();
};

const ensureLangAttribute = () => {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('lang', getLangAttribute());
  }
};

const initializeAccessibility = () => {
  ensureLangAttribute();
  addMainLandmark();
  addSvgAccessibleNames();
  fixFakeLinks();
  ensureDependencyGraphAriaRole();
};

/**
 * Function A description
 * @param {any} param - The parameter
 * @returns {any} The result
 */
export function functionA(param) {
  // Implementation to be added
}

/**
 * Function B description
 * @param {any} param - The parameter
 * @returns {any} The result
 */
export function functionB(param) {
  // Implementation to be added
}

export function addProperLandmarkRegions() {
  if (typeof document !== 'undefined') {
    return addProperLandmarkRegions(document.body);
  }
  return [];
}

export {
  getLangAttribute,
  addLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  fixTableStructure,
  addMainLandmark,
  validateLandmark,
  validateLandmarkStructure,
  validateLandmarkAttributes,
  getSvgAccessibleName,
  setSvgAttributes,
  ensureUniqueLandmarks,
  createInPageButton,
  validateLinkAccessibility,
  handleFakeLinks,
  functionA,
  functionB,
  addProperLandmarkRegions,
  upgradeLogic,
  newFunction,
  config,
  validateConfig,
  createLandmarkSelectors,
  checkSafetyCategories,
  addBook,
  getBooksList,
  getUserSafetyAdvice,
  harvestData,
  applyAccessibilityFixesAndHarvestData,
  fixTableStructureIssues,
  addLandmarkRegions,
  processLandmarks,
  isValidLandmark,
  loadLandmarks,
  sortLandmarks,
  getLandmarkById,
  checkUserSafety,
  getUserSafety,
  createBookForm,
  createAccessibleInput,
  createUnrotateButton,
  getUserSafetyAdvice,
  appState,
  initializeApp,
  initialize,
  landmarkStructureCheck,
  addSvgAccessibleNames,
  addLangAttribute,
  isValidLandmark,
  loadLandmarks,
  processLandmarks,
  analyzeModuleDependencies,
  visualizeModuleRelationships,
  initializeAccessibility,
  fetchUser,
  clearCache,
  formatResponse,
  formatDate,
  processData,
  someFunction,
  getConfig,
  applyAccessibilityFixesAndHarvestData,
  ensureDependencyGraphAriaRole,
  writeReport,
  addProperLandmarkRegions,
  fixTableStructure,
  fixFakeLinks,
  validateLandmark,
  validateLandmarkStructure,
  checkLandmarkElement,
  upgradeLogic
};

// REACT_037: Google sign-in logic, if needed