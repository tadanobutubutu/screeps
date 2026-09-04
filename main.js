const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const path = require('path');
const fastMap = require('fast-map');
const { a11y } = require('@accessible/react');
const {
  fixTableStructureIssues,
  fixTableHeaderCellScope,
  addMainLandmark,
  addSvgAccessibleNames,
  fixFakeLinks,
  ensureUniqueLandmarks,
  addLandmarkRoles,
  renderDependencyGraph,
  displayModuleStructure,
  countDependencies,
  analyzeModuleDependencies,
  visualizeModuleRelationships
} = require('./accessibility-improvements');

// Configuration for landmark operations
const LANDMARK_CONFIG = {
    dataPath: './data',
    maxResults: 100
};

// General application configuration (merged from both)
const CONFIG = {
  dataPath: './data',
  maxResults: 100,
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  timeout: process.env.TIMEOUT || 5000,
  debug: true,
  version: '1.0.0',
  // Include properties from HEAD's config
  name: 'MyApp',
  // Use process.env.API_URL from HEAD with fallback to origin/main
  apiKey: process.env.API_KEY || 'default-key'
};

// Alternative config style for backwards compatibility
const config = CONFIG;

// Application state (merged)
let isInitialized = false;
const appData = {
    title: 'Screeps',
    version: '1.0.0'
};

const appState = {
  initialized: false,
  data: null,
  cache: {},
  lang: 'en',
  credentials: null,
  error: null
};

// Helper functions (merged)
function helper(input) {
  return input ? input.toUpperCase() : '';
}

function function3(...args) {
  return args.map(arg => arg.toString());
}

function formatDate(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  return date.toISOString().split('T')[0];
}

function validateInput(input) {
  return input && typeof input === 'string' && input.trim().length > 0;
}

function processData(data) {
  if (!data) return null;
  return { ...data, processed: true };
}

function initialize() {
  if (!isInitialized) {
    isInitialized = true;
    appState.initialized = true;
    
    // Accessibility improvements from both branches
    addressAccessibilityIssues();
    wrapPrimaryContentInMain();
    validateTableStructureIssues();
    fixTableHeaderCellScope();
    addMainLandmark();
    addSvgAccessibleNames();
    fixFakeLinkIssues();
    ensureUniqueLandmarks();
    addLandmarkRoles();
    renderDependencyGraph();
    displayModuleStructure();
    countDependencies();
    analyzeModuleDependencies();
    visualizeModuleRelationships();
    
    console.log('Application initialized');
  }
  return appState;
}

function initializeApp() {
  initialize();
  return appState;
}

async function fetchUser(userId) {
  if (!userId) {
    return null;
  }
  return { id: userId, name: 'User ' + userId };
}

function clearCache() {
  appState.cache = {};
}

function someFunction() {
  return 'some value';
}

// Accessibility functions (merged and enhanced)
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

function getLangAttribute() {
    return (typeof document !== 'undefined' && document.documentElement.lang) || 
           (typeof navigator !== 'undefined' && navigator.language) || 
           'en-US';
}

function getFullLangAttribute() {
  return getLangAttribute();
}

function validateTableAccessibility(table) {
    const issues = [];
    if (table.querySelector && !table.querySelector('caption')) {
        issues.push('Missing caption element');
    }
    if (table.getAttribute && !table.getAttribute('headers')) {
        issues.push('Missing headers attribute');
    }
    const headerCells = table.querySelectorAll ? table.querySelectorAll('th') : [];
    headerCells.forEach(cell => {
        if (cell.getAttribute && !cell.getAttribute('scope') && !cell.getAttribute('id')) {
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
    const tableArray = Array.isArray(tables) ? tables : [tables];
    tableArray.forEach((table, index) => {
        const rows = table.querySelectorAll ? table.querySelectorAll('tr') : [];
        if (rows.length === 0) {
            allIssues.push({ tableIndex: issues: ['Table has no rows'] });
        }
        const result = validateTableAccessibility(table);
        if (!result.success) {
            allIssues.push({ tableIndex: index, issues: result.issues });
        }
    });
    return {
        success: allIssues.length === 0,
        issues: allIssues
    };
}

function validateLandmarkStructure(landmarks) {
    const issues = [];
    if (Array.isArray(landmarks)) {
        landmarks.forEach((landmark, index) => {
            const result = validateLandmark(landmark);
            if (!result.success) {
                issues.push({ landmarkIndex: index, issues: result.issues });
            }
        });
    } else {
        const allLandmarks = (typeof document !== 'undefined' && document.querySelectorAll) ? 
            document.querySelectorAll('header, nav, main, aside, footer, section, article') : [];
        let hasMain = false;
        allLandmarks.forEach(landmark => {
            const role = landmark.getAttribute ? landmark.getAttribute('role') : landmark.tagName;
            if (role === 'main') hasMain = true;
        });
        if (!hasMain) {
            issues.push('Missing main landmark');
        }
    }
    return {
        success: issues.length === 0,
        issues
    };
}

function ensureUniqueLandmarks(landmarks) {
    const names = [];
    const duplicates = [];
    let elementsToCheck = landmarks;
    if (!Array.isArray(landmarks)) {
        elementsToCheck = (typeof document !== 'undefined' && document.querySelectorAll) ? 
            document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"], [role="region"]') : [];
    }
    elementsToCheck.forEach(landmark => {
        const name = landmark.ariaLabel || (landmark.getAttribute ? landmark.getAttribute('aria-labelledby') : null) || landmark.textContent;
        if (names.includes(name)) {
            duplicates.push('Duplicate accessible name: ' + name);
        } else {
            names.push(name);
        }
    });
    const elementsById = {};
    elementsToCheck.forEach(landmark => {
        if (landmark.id) {
            if (elementsById[landmark.id]) {
                duplicates.push('Duplicate ID: ' + landmark.id);
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

function getUniqueLandmarks() {
  if (typeof document === 'undefined') return [];
  const landmarks = document.querySelectorAll(landmarkSelectors.join(','));
  const seen = new Set();
  const unique = [];
  landmarks.forEach(el => {
    const id = el.id || el.getAttribute('aria-label') || el.tagName.toLowerCase();
    if (!seen.has(id)) {
      seen.add(id);
      unique.push(el);
    }
  });
  return unique;
}

function addAccessibilityProps() {
  const landmarks = getUniqueLandmarks();
  addProperLandmarkRegions(landmarks);
  validateTableStructure();
  validateLinkAccessibility();
}

function addProperLandmarkRegions(landmarks) {
  // Implementation to add proper landmark regions
  landmarks.forEach(landmark => {
    if (!landmark.getAttribute('role')) {
      const tagName = landmark.tagName.toLowerCase();
      const roleMap = {
        'header': 'banner',
        'nav': 'navigation',
        'main': 'main',
        'footer': 'contentinfo',
        'aside': 'complementary',
        'section': 'region'
      };
      if (roleMap[tagName]) {
        landmark.setAttribute('role', roleMap[tagName]);
      }
    }
  });
}

function validateLinkAccessibility() {
  // Implementation to validate link accessibility
  const links = document ? document.querySelectorAll('a') : [];
  links.forEach(link => {
    if (!link.getAttribute('aria-label') && !link.textContent) {
      console.warn('Link missing accessible name:', link);
    }
  });
}

function validateLandmark(landmark) {
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
  return {
    valid: errors.length === 0,
    errors
  };
}

function validateLandmarkData(landmark) {
  return validateLandmark(landmark);
}

function setSvgAttributesLocal(svgElement, label, labelledById) {
  if (!svgElement) return;
  const props = getSvgPropsLocal(label, labelledById);
  Object.entries(props).forEach(([prop, value]) => {
    svgElement.setAttribute(prop, value);
  });
}

function getSvgPropsLocal(label, labelledById) {
  const props = {};
  if (label) {
    props['aria-label'] = label;
  }
  if (labelledById) {
    props['aria-labelledby'] = labelledById;
  }
  return props;
}

function addSvgAccessibilityProps(svg) {
  return svg;
}

function getSvgAccessibilityProps(svg) {
  return {};
}

function getAccessibleLinkProps(link) {
  return {};
}

function createAccessibleLink(href, label) {
  return {
    href,
    'aria-label': label,
    role: 'link'
  };
}

function createInPageButton(buttonText, onClickHandler) {
  return {
    button: {
      onClick: onClickHandler,
      lang: getLangAttribute(),
      text: buttonText
    }
  };
}

function wrapPrimaryContentInMain(content) {
  return content;
}

function addLangAttribute(element, lang) {
  return element;
}

function ensureDependencyGraphAriaRole() {
  const dependencyGraphEl = document ? document.querySelector('#dependencyGraph') : null;
  if (dependencyGraphEl) {
    dependencyGraphEl.setAttribute('role', 'region');
  }
}

function calculateSum(a, b) {
  return a + b;
}

function deduplicateLandmarks(landmarks) {
  // Implementation to deduplicate landmarks
  const unique = [];
  const seen = new Set();
  landmarks.forEach(landmark => {
    const id = landmark.id || landmark.name;
    if (!seen.has(id)) {
      seen.add(id);
      unique.push(landmark);
    }
  });
  return unique;
}

function createAccessibleBookEntry(bookData) {
  return {
    ...bookData,
    accessible: true
  };
}

function validateBookAccessibility(bookData) {
  const errors = [];
  if (!bookData.title) errors.push('Title is required');
  if (!bookData.author) errors.push('Author is required');
  return {
    valid: errors.length === 0,
    errors
  };
}

// Google sign-in logic (from HEAD)
function handleCredentialResponse(response) {
  try {
    const data = typeof response === 'string' ? JSON.parse(response) : response;
    if (!data || typeof data !== 'object') {
      appState.error = 'Invalid credential response format';
      return { success: false, error: 'Invalid credential response format' };
    }
    appState.credentials = data;
    return { success: true, data };
  } catch (error) {
    appState.error = error.message;
    return { success: false, error: error.message };
  }
}

// Check if landmark element exists in DOM
function checkLandmarkElement(id) {
  if (typeof document === 'undefined') return false;
  const element = document.getElementById(id);
  return element !== null;
}

// Process accessibility report (merged)
function scanAccessibility() {
  return {
    timestamp: new Date().toISOString(),
    violations: [],
    passes: [],
    incomplete: [],
    inapplicable: []
  };
}

function writeReport(report) {
  const reportFile = path.join(__dirname, 'accessibility-report.json');
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
}

function generateAccessibilityReport() {
  return scanAccessibility();
}

function processAccessibilityReport() {
  const report = scanAccessibility();
  writeReport(report);
  return report;
}

function addressAccessibilityIssues() {
  // Implementation to address accessibility issues
  console.log('Addressing accessibility issues...');
}

function fixFakeLinkIssues() {
  // Implementation to fix fake link issues
  const links = document ? document.querySelectorAll('a') : [];
  links.forEach(link => {
    if (link.textContent === 'click here' || link.textContent === 'here') {
      link.setAttribute('aria-label', link.textContent);
    }
  });
}

// Server setup (from origin/main)
const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

// Server endpoints for books (from origin/main, enhanced with accessibility)
app.post('/books', express.json(), (req, res) => {
    const bookData = req.body;
    const validation = validateBookAccessibility(bookData);
    if (!validation.valid) {
        return res.status(400).json({ error: 'Invalid book data', details: validation.errors });
    }
    const accessibleBook = createAccessibleBookEntry(bookData);
    // Here you would typically save to a database
    res.status(201).json(accessibleBook);
});

app.get('/books', (req, res) => {
    // Implementation to get all books
    res.json([]);
});

app.get('/books/:id', (req, res) => {
    const { id } = req.params;
    // Implementation to get a book by ID
    res.json({ id, title: 'Sample Book' });
});

app.put('/books/:id', express.json(), (req, res) => {
    const { id } = req.params;
    const bookData = req.body;
    const validation = validateBookAccessibility(bookData);
    if (!validation.valid) {
        return res.status(400).json({ error: 'Invalid book data', details: validation.errors });
    }
    // Implementation to update a book
    res.json({ id, ...bookData });
});

app.delete('/books/:id', (req, res) => {
    const { id } = req.params;
    // Implementation to delete a book
    res.status(204).send();
});

// Start the server
app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});

// Accessibility functions object (merged)
const accessibilityFunctions = {
  validateLandmarkObject: validateLandmark,
  addSvgAccessibilityProps,
  getSvgAccessibilityProps,
  getAccessibleLinkProps,
  getLangAttribute,
  createInPageButton,
  wrapPrimaryContentInMain,
  addLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmarkStructure,
  ensureUniqueLandmarks,
  getUniqueLandmarks,
  addAccessibilityProps,
  addProperLandmarkRegions,
  validateLinkAccessibility,
  checkLandmarkElement,
  validateLandmarkData,
  setSvgAttributesLocal,
  getSvgPropsLocal,
  createAccessibleLink,
  calculateSum,
  deduplicateLandmarks,
  createAccessibleBookEntry,
  validateBookAccessibility,
  handleCredentialResponse,
  scanAccessibility,
  writeReport,
  generateAccessibilityReport,
  processAccessibilityReport,
  addressAccessibilityIssues,
  fixFakeLinkIssues,
  ensureDependencyGraphAriaRole
};

// HTML template (from origin/main)
const HTML = ({ lang }) => `<html lang="${lang}"><head></head><body></body></html>`;

// Utilities (merged)
const utils = require('./utils');
const { validateInput: utilsValidateInput, processData: utilsProcessData } = utils;
const { formatResponse } = require('./formatters');

// Module exports (merged)
module.exports = {
    appData,
    CONFIG,
    LANDMARK_CONFIG,
    HTML,
    validateTableAccessibility,
    validateTableStructure,
    processAccessibilityReport,
    ensureUniqueLandmarks,
    validateInput,
    processData,
    formatDate,
    initialize,
    initializeApp,
    fetchUser,
    clearCache,
    someFunction,
    helper,
    function3,
    app,
    appState,
    config,
    isInitialized,
    PORT,
    HOST,
    accessibilityFunctions,
    improveAccessibility: () => {
      fixTableStructureIssues();
      fixTableHeaderCellScope();
      addMainLandmark();
      addSvgAccessibleNames();
      fixFakeLinks();
      ensureUniqueLandmarks();
      addLandmarkRoles();
      renderDependencyGraph();
      displayModuleStructure();
      countDependencies();
      analyzeModuleDependencies();
      visualizeModuleRelationships();
    },
    getLangAttribute,
    validateLandmarkStructure,
    writeReport,
    scanAccessibility,
    getUniqueLandmarks,
    addAccessibilityProps,
    addProperLandmarkRegions,
    validateLinkAccessibility,
    checkLandmarkElement,
    validateLandmarkData,
    setSvgAttributesLocal,
    getSvgPropsLocal,
    createAccessibleLink,
    calculateSum,
    deduplicateLandmarks,
    createAccessibleBookEntry,
    validateBookAccessibility,
    handleCredentialResponse,
    generateAccessibilityReport,
    addressAccessibilityIssues,
    fixFakeLinkIssues,
    ensureDependencyGraphAriaRole
};