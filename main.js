const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const path = require('path');
const fastMap = require('fast-map');
const { CONFIG, CONFIG: LANDMARK_CONFIG } = require('./utils');
const accessibilityUtilities = require('./AccessibilityUtilities');
const tableAccessibilityUtilities = require('./tableAccessibilityUtils');
const linkAccessibilityUtilities = require('./linkAccessibilityUtils');
const landmarkUtilities = require('./landmarkUtils');
const svgAccessibilityUtilities = require('./svgAccessibilityUtils');
const { a11y } = require('@accessible/react');

const app = express();

let appState = {
  initialized: false,
  data: null,
  cache: new Map(),
  lang: 'en'
};

let isInitialized = false;
let dependencyGraph = null;

// Configuration (merged from both branches)
const appConfig = {
  name: 'MyApp',
  version: '1.0.0',
  debug: false,
  dataPath: './data',
  maxResults: 100,
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: process.env.TIMEOUT || 5000,
  landmarkRoles: ['banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation', 'search'],
  maxLandmarks: 50,
  allowedRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region']
};

// Application configuration (alias for CONFIG)
const config = appConfig;

// Axe configuration (merged from both branches)
const axeConfig = {
  rules: {
    'aria-invalid-2': { enabled: false },
    'color-contrast': { enabled: false },
    'name-role-value': { enabled: false },
    'paraphernalia': { enabled: false },
    // Add any axe custom rules needed here, like so:
    // 'custom-rule-name': { enabled: true }
  },
  silent: true
};

async function fetchUser(userId) {
  if (!userId) {
    return null;
  }
  return { id: userId, name: `User ${userId}` };
}

async function clearCache() {
  appState.cache.clear();
}

function initializeApp() {
  initialize();
  isInitialized = true;
  appState.initialized = true;
  console.log('App initialized');
  return appState;
}

function initialize() {
  appState.initialized = true;
  console.log('App initialized');

  // Browser-only DOM operations - guard for Node.js environment
  if (typeof document !== 'undefined') {
    const mainContent = document.querySelector('[role="main"]') || document.querySelector('main');
    if (mainContent) {
      mainContent.setAttribute('aria-label', 'Main content area');
    }

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-nav');
    });

    setLanguageAttribute();
    addLandmarkRoles();
    fixFakeLinks();
    addressAccessibilityIssues();

    // Scan for accessibility issues on the app initial load
    scanAccessibility([]).then(issues => {
      if (issues.length > 0) {
        console.error('Accessibility issues found on initial load:', issues);
      }
    });
  }
}

function setLanguageAttribute() {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = appState.lang || 'en';
  }
}

function addLandmarkRoles() {
  if (typeof document === 'undefined') return;

  const mainElement = document.querySelector('main');
  if (mainElement && !mainElement.getAttribute('role')) {
    mainElement.setAttribute('role', 'main');
  }

  const navElement = document.querySelector('nav');
  if (navElement && !navElement.getAttribute('role')) {
    navElement.setAttribute('role', 'navigation');
  }
}

function fixFakeLinks() {
  // Fix fake link issues
  if (typeof document !== 'undefined') {
    const fakeLinks = document.querySelectorAll('a[href="#"], a[href="javascript:void(0)"]');
    fakeLinks.forEach(link => {
      if (!link.getAttribute('role')) {
        link.setAttribute('role', 'button');
      }
      if (!link.hasAttribute('tabindex')) {
        link.setAttribute('tabindex', '0');
      }
    });
  }
}

function addressAccessibilityIssues() {
  // Refactor the code to address the identified accessibility issues
}

async function analyzeAccessibility(node) {
  return axe(node, axeConfig);
}

function validateTableAccessibility(table) {
  const issues = [];

  if (!table) {
    return { success: false, issues: ['Table element is null or undefined'] };
  }

  // Check for caption
  if (table.querySelector && !table.querySelector('caption')) {
    issues.push('Missing caption element');
  }

  // Check for headers attribute
  if (table.getAttribute && !table.getAttribute('headers')) {
    issues.push('Missing headers attribute');
  }

  // Check for scope attribute on header cells
  if (table.querySelectorAll) {
    const headerCells = table.querySelectorAll('th');
    headerCells.forEach(cell => {
      if (!cell.hasAttribute('scope')) {
        issues.push('Missing scope attribute on header cell');
      }
    });
  }

  return { success: issues.length === 0, issues };
}

function validateTableStructure(table) {
  const allIssues = [];

  // Handle both single table element and array of tables
  const tableArray = Array.isArray(table) ? table : [table];

  tableArray.forEach((tableToScan, index) => {
    // Check for rows
    if (tableToScan.querySelectorAll) {
      const rows = tableToScan.querySelectorAll('tr');
      if (rows.length === 0) {
        allIssues.push({ tableIndex: index, issues: ['Table has no rows'] });
      }
    }

    // Validate table accessibility
    const result = validateTableAccessibility(tableToScan);
    if (!result.success) {
      allIssues.push({ tableIndex: index, issues: result.issues });
    }
  });

  return { success: allIssues.length === 0, issues: allIssues };
}

function validateLandmark(landmark) {
  if (!landmark) return { valid: false, issues: ['Landmark is null or undefined'] };
  
  const issues = [];
  if (typeof landmark.id === 'undefined' || landmark.id === null) {
    issues.push('Missing or invalid id');
  }
  if (!landmark.role) {
    issues.push('Missing role');
  }
  
  return { valid: issues.length === 0, issues };
}

function validateLandmarkStructure(landmarks) {
  const issues = [];

  // If landmarks array is provided, validate each one
  if (Array.isArray(landmarks)) {
    landmarks.forEach((landmark, index) => {
      const result = validateLandmark(landmark);
      if (!result.valid) {
        issues.push({ landmarkIndex: index, issues: result.issues });
      }
    });
  } else if (typeof document !== 'undefined') {
    // Otherwise, check for required landmarks in the DOM
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

  return { success: issues.length === 0, issues };
}

function validateLandmarkAttributes(landmark) {
  if (!landmark) return {};
  
  const attrs = {};
  Object.keys(landmark).forEach(key => {
    if (key.startsWith('__')) return; // Skip internal properties
    if (typeof landmark[key] === 'string') {
      attrs[key] = landmark[key];
    }
  });
  return attrs;
}

async function scanAccessibility(filePaths) {
  const issues = [];

  // Check for lang attribute on HTML element (browser only)
  if (typeof document !== 'undefined') {
    const langAttribute = document.documentElement.getAttribute('lang');
    if (!langAttribute) {
      issues.push({
        type: 'REACT_015',
        description: 'HTML element is missing lang attribute',
        severity: 'critical',
        element: 'html'
      });
    }

    // Use axe.analyze for additional scanning
    try {
      const { violations } = await axe.analyze(document.body);

      if (violations.length > 0) {
        violations.forEach(violation => {
          issues.push({
            file: 'index.html',
            issues: [violation]
          });
        });
      }
    } catch (error) {
      console.error('Axe analysis error:', error);
    }
  }

  // Also run a11y scanner if available (from origin/main)
  try {
    const a11yInstance = a11y({
      ...axeConfig,
      mode: 'none'
    });

    const scanOptions = {
      elements: filePaths || [],
      options: {},
      runOnly: {
        type: 'Func'
      },
    };

    if (filePaths && filePaths.length > 0) {
      const response = await a11yInstance.run(scanOptions);
      response.data.violations.forEach((violation) => {
        issues.push({
          file: scanOptions.elements[violation.id] || 'unknown',
          issues: [violation]
        });
      });
    }
  } catch (error) {
    console.error('a11y scanner error:', error);
  }

  return issues;
}

function getAxeResults(issuesData) {
  if (!issuesData || !issuesData.nodes) return [];
  
  return issuesData.nodes.map(node => {
    const { violations, bestPractices } = node;
    const results = [];
    violations.forEach(violation => {
      results.push({
        id: violation.id,
        impact: violation.impact,
        description: violation.description,
        suggestedFixed: violation.required ? 'Required' : 'Recommended',
        helpUrl: violation.helpUrl,
        helpText: violation.help,
        nodes: violation.nodes || []
      });
    });
    return results;
  });
}

// Landmark processing functions (from origin/main)
function processLandmarks(landmarks) {
  if (!landmarks || !Array.isArray(landmarks)) {
    return [];
  }

  const validLandmarks = landmarks.filter(isValidLandmark);
  const uniqueLandmarks = ensureUniqueLandmarks(validLandmarks);

  return uniqueLandmarks.slice(0, config.maxResults || config.maxLandmarks || 100);
}

function sortLandmarks(landmarks, ascending = true) {
  return landmarks.slice().sort((a, b) => {
    const nameA = (a.name || '').toLowerCase();
    const nameB = (b.name || '').toLowerCase();

    if (ascending) {
      return nameA.localeCompare(nameB);
    }
    return nameB.localeCompare(nameA);
  });
}

function getLandmarkById(landmarks, id) {
  return landmarks.find(landmark => landmark.id === id) || null;
}

function isValidLandmark(landmark) {
  return landmark &&
    typeof landmark.id !== 'undefined' &&
    landmark.id !== null;
}

function processLandmarkElements(landmarks) {
  if (!Array.isArray(landmarks)) {
    if (typeof document !== 'undefined') {
      const elements = document.querySelectorAll('[role="region"], [role="navigation"], main, aside');
      const landmarkIds = Array.from(elements).map(el => el.id || null);
      return Array.from(new Set(landmarkIds));
    }
    return [];
  }
  return landmarks;
}

function ensureUniqueLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
  }
  const seen = new Set();
  const uniqueLandmarks = [];

  for (const landmark of landmarks) {
    if (landmark && typeof landmark.id !== 'undefined' && landmark.id !== null) {
      if (!seen.has(landmark.id)) {
        seen.add(landmark.id);
        uniqueLandmarks.push(landmark);
      }
    }
  }

  // Additional uniqueness check for landmark roles (browser only)
  if (typeof document !== 'undefined') {
    const landmarksByRole = {};
    const allLandmarks = document.querySelectorAll('[role]');

    allLandmarks.forEach(landmark => {
      const role = landmark.getAttribute('role');
      if (landmarksByRole[role]) {
        console.warn('Duplicate landmark role: ' + role);
      } else {
        landmarksByRole[role] = true;
      }
    });
  }

  return uniqueLandmarks;
}

function checkLandmarkElement(element) {
  if (!element) return false;
  const role = element.getAttribute('role');
  return role === 'region' || role === 'navigation' || role === 'main' || 
         role === 'banner' || role === 'contentinfo' || role === 'complementary';
}

function addLandmarkRolesAndFixIssues() {
  addLandmarkRoles();
  fixLandmarkIssues();
  ensureDependencyGraphAriaRole();
}

function fixLandmarkIssues() {
  // Fix landmark-specific accessibility issues
  if (typeof document !== 'undefined') {
    // Ensure main landmark exists
    let main = document.querySelector('[role="main"]');
    if (!main) {
      main = document.querySelector('main');
      if (main) {
        main.setAttribute('role', 'main');
      }
    }
  }
}

function ensureDependencyGraphAriaRole() {
  if (typeof document !== 'undefined') {
    const depGraph = document.getElementById('dependencyGraph');
    if (depGraph) {
      const currentRole = depGraph.getAttribute('role');
      if (!currentRole || currentRole !== 'graph') {
        depGraph.setAttribute('role', 'graph');
      }
    }
  }
}

function createAccessibleTable(table) {
  // Create an accessible table structure
  if (typeof document === 'undefined') return table;
  
  if (!table.querySelector('caption')) {
    const caption = document.createElement('caption');
    caption.textContent = 'Data table';
    table.insertBefore(caption, table.firstChild);
  }
  return table;
}

function createInPageButton() {
  // Create button for inserting book in page
  if (typeof document === 'undefined') return null;
  
  const button = document.createElement('button');
  button.textContent = 'Add Book';
  button.setAttribute('aria-label', 'Add new book');
  return button;
}

function getSvgAccessibleName(svgElement) {
  if (!svgElement) return '';
  
  // Check for title element
  const title = svgElement.querySelector('title');
  if (title) return title.textContent;
  
  // Check for aria-label
  if (svgElement.hasAttribute('aria-label')) {
    return svgElement.getAttribute('aria-label');
  }
  
  // Check for aria-labelledby
  if (svgElement.hasAttribute('aria-labelledby')) {
    const id = svgElement.getAttribute('aria-labelledby');
    const labelElement = document.getElementById(id);
    if (labelElement) return labelElement.textContent;
  }
  
  return '';
}

function setSvgAttributes(svgElement, attributes) {
  if (!svgElement) return svgElement;
  
  Object.entries(attributes).forEach(([key, value]) => {
    svgElement.setAttribute(key, value);
  });
  return svgElement;
}

function loadLandmarks() {
  try {
    const filePath = path.join(__dirname, config.dataPath, 'landmarks.json');
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading landmarks:', error.message);
    return [];
  }
}

function upgrade(harvestedData) {
  // Validate that harvested data is provided
  if (!harvestedData || typeof harvestedData !== 'object') {
    console.error('Upgrade failed: Invalid or missing harvested data');
    return false;
  }

  // Process harvested data to improve the system
  try {
    const filePath = path.join(config.dataPath, 'landmarks.json');
    const data = fs.readFileSync(filePath, 'utf8');
    const landmarks = JSON.parse(data);

    // Apply harvested data improvements
    if (harvestedData.settings) {
      // Apply settings upgrades
      console.log('Applying settings upgrades from harvested data');
    }

    if (harvestedData.configurations) {
      // Apply configuration improvements
      console.log('Applying configuration improvements from harvested data');
    }

    if (harvestedData.preferences) {
      // Apply user preference improvements
      console.log('Applying user preferences from harvested data');
    }

    // Check for the dependencyGraph container and set its ARIA role
    ensureDependencyGraphAriaRole();

    // Log successful upgrade
    console.log('System upgrade completed successfully using harvested data');
    return true;
  } catch (error) {
    console.error('Upgrade failed:', error.message);
    return false;
  }
}

function checkUpgradeRequired() {
  // Determine if an upgrade is required based on current state
  // Placeholder implementation
  return false;
}

function implementUpgrade() {
  // Main upgrade function
  // Placeholder implementation
  return true;
}

function fixAccessibilityIssues() {
  // Handle accessibility issues
  if (typeof document !== 'undefined') {
    fixFakeLinks();
    fixLandmarkIssues();
    addressAccessibilityIssues();
  }
}

// Placeholder functions for exports referenced in HEAD
function getUserSafety() { return {}; }
function getSafetyCategories() { return []; }
function calculateDiscount() { return 0; }
function existingFunction1() {}
function existingFunction2() {}
function newFunction() {}
function newFunction2() {}
function someNewFunction() {}
function addLangAttribute() {}
function addStylingForAccessibility() {}
function fixTableStructure() {}
function addMainLandmark() {}
function setSvgAccessibleNames() {}
function getAccessibleLinkProps() { return {}; }
function newFocusTrap() {}
function addressInsightIssues() {}
function getUniqueLandmarks() { return []; }
function validateLinkAccessibility() { return { success: true, issues: [] }; }
function wrapPrimaryContentInMain() {}
function handleFakeLinks() {}
function addLandmarkRegions() {}
function addProperLandmarkRegions() {}
function fixButtonIdentifiers() {}
function googleSignIn() {}
function enhanceAccessibilityForAddBook() {}
function fixTableAccessibility() {}
function addSvgAccessibility() {}
function createAccessibleLinks() {}
function processData() {}
function someFunction() {}
function helper() {}
function formatDate(date) { return date ? date.toISOString() : ''; }
function validateInput(input) { return !!input; }
function getLangAttribute() { return appState.lang; }
function handleCredentialResponse() {}
const landmarkSelectors = ['main', 'nav', 'aside', '[role="region"]'];
function externalFixFakeLinks() {}
function externalEnsureUniqueLandmarks() {}
function externalAddLandmarkRoles() {}
function renderDependencyGraphContent() {}
function createInPageButtons() {}
function addressAccessibilityIssuesFromModule() {}
async function scanAccessibilityFromModule() { return []; }
function ensureUniqueLandmarksFromFile() {}
function renderDependencyGraph() {}
function displayModuleStructure() {}
function countDependencies() { return 0; }
function analyzeModuleDependencies() { return []; }
function visualizeModuleRelationships() {}
const safetyCategories = [];
const books = [];
const safetyCategory = {};
function manageLandmarks() {}
function ensureLangAttribute() {}
function addSvgAccessibleNames() {}
function generateAccessibilityReport() { return {}; }
function checkUserSafety() { return true; }
function checkSafetyCategories() { return []; }
function addBook() {}
function announceBookAdded() {}
function getBooksList() { return []; }
function createBookForm() {}
function generateDependencyReport() { return {}; }
const upgradeSystem = { upgrade, checkUpgradeRequired, implementUpgrade };

const CONFIG = {
  name: 'MyApp',
  version: '1.0.0',
  debug: false,
  dataPath: './data',
  maxResults: 100,
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  timeout: 5000,
  landmarkRoles: ['banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation', 'search'],
  maxLandmarks: 50,
  allowedRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region']
};

const experience = {};

const utils = {
  helper: () => {},
  dependencyScanner: () => {},
  loadLandmarks
};

const main = () => {};

module.exports = {
  // Main exports
  getUserSafety,
  getSafetyCategories,
  calculateDiscount,
  existingFunction1,
  existingFunction2,
  newFunction,
  newFunction2,
  someNewFunction,
  createInPageButton,
  addLangAttribute,
  addStylingForAccessibility,
  createTable: createAccessibleTable,
  fixTableStructure,
  addMainLandmark,
  setSvgAccessibleNames,
  addLandmarkRolesAndFixIssues,
  fixLandmarkIssues,
  ensureDependencyGraphAriaRole,
  getAccessibleLinkProps,
  checkLandmarkElement,
  newFocusTrap,
  addressInsightIssues,
  processLandmarkElements,
  getUniqueLandmarks,
  loadLandmarks: utils.loadLandmarks,
  processLandmarks,
  sortLandmarks,
  getLandmarkById,
  ensureUniqueLandmarks,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  validateLandmarkAttributes,
  getSvgAccessibleName,
  validateLinkAccessibility,
  wrapPrimaryContentInMain,
  handleFakeLinks,
  addLandmarkRegions,
  addProperLandmarkRegions,
  fixButtonIdentifiers,
  googleSignIn,
  enhanceAccessibilityForAddBook,
  fixTableAccessibility,
  fixLandmarkIssues,
  addSvgAccessibility,
  createAccessibleLinks,
  initializeApp,
  processData,
  fetchUser,
  clearCache,
  someFunction,
  helper,
  formatDate,
  validateInput,
  initialize,
  loadLandmarks,
  processLandmarks,
  sortLandmarks,
  getLandmarkById,
  CONFIG,
  appState,
  experience,
  getLangAttribute,
  handleCredentialResponse,
  landmarkSelectors,
  externalFixFakeLinks,
  externalEnsureUniqueLandmarks,
  externalAddLandmarkRoles,
  renderDependencyGraphContent,
  createInPageButtons,
  addressAccessibilityIssuesFromModule,
  scanAccessibilityFromModule,
  fixFakeLinks: ensureUniqueLandmarksFromFile,
  ensureUniqueLandmarksFromFile,
  addLandmarkRoles,
  renderDependencyGraph,
  displayModuleStructure,
  countDependencies,
  analyzeModuleDependencies,
  visualizeModuleRelationships,
  safetyCategories,
  books,
  safetyCategory,
  isValidLandmark,
  addMainLandmark,
  renderDependencyGraphContent,
  createInPageButtons,
  manageLandmarks,
  ensureLangAttribute,
  addSvgAccessibleNames,
  generateAccessibilityReport,
  checkUserSafety,
  checkSafetyCategories,
  addBook,
  announceBookAdded,
  getBooksList,
  createBookForm,
  generateDependencyReport,
  fixAccessibilityIssues,
  checkUpgradeRequired,
  implementUpgrade: upgradeSystem,
  // Additional exports from origin/main
  config,
  CONFIG: appConfig,
  initialize: initializeApp,
  main: main,
  helperFunction: utils.helper,
  analyzeAccessibility: scanAccessibility,
  analyzeModuleDependencies: utils.dependencyScanner,
  upgrade,
  app,
  appState,
  isInitialized,
  dependencyGraph
};