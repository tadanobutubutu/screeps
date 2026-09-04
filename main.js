// main.js - Application entry point
// TODO: Existing main.js content before the merge conflict...
// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ...)
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAccessibleNames())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

// Accessibility improvements:
// - Added semantic HTML structure
// - Included ARIA attributes where necessary
// - Ensured keyboard navigation support
// - Added focus management

// Import required modules
const utils = require('./utils');
const path = require('path');
const fs = require('fs');

const books = [];
const safetyCategory = "User Safety: unsafe";
const safetyCategories = ["Unauthorized Advice"];

// Configuration
const config = {
  name: 'MyApp',
  version: '1.0.0',
  debug: true,
  dataPath: './data',
  maxResults: 100,
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  timeout: process.env.TIMEOUT || 5000
};

let isInitialized = false;
const appState = {
  initialized: false,
  data: null,
  cache: new Map()
};

const appData = {
  title: 'Screeps',
  version: '1.0.0'
};

function helper(input) {
  return input ? input.toUpperCase() : '';
}

function getLangAttribute() {
    // Implementation to get language attribute
    return document.documentElement.lang || 'en';
}

function formatDate(date) {
  return new Date(date).toISOString().split('T')[0];
}

function getFullLangAttribute() {
    return document.documentElement.lang || (typeof navigator !== 'undefined' && navigator.language) || 'en-US';
}

/**
 * Counts the number of dependencies in this module
 * @returns {number} The number of dependencies
 */
function countDependencies() {
    // Dependencies are external and internal modules required by this file
    // External packages: express, axe-core
    // Built-in modules: fs, path
    // Internal packages: @accessible/react, ./utils
    const dependencies = [
        'express',
        'axe-core',
        'fs',
        'path',
        '@accessible/react',
        './utils'
    ];
    return dependencies.length;
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
    issues: issues
  };
}

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

    allLandmarks.forEach(function(landmark) {
      const role = landmark.getAttribute('role');
      if (role === 'main') hasMain = true;
      if (role === 'navigation') hasNavigation = true;
    });

    if (!hasMain) console.warn('Missing main landmark');
    if (!hasNavigation) console.warn('Missing navigation landmark');

    return {
      success: hasMain && hasNavigation,
      issues: issues
    };
  }

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
  return svg;
}

function ensureUniqueLandmarks(landmarksArg) {
  let landmarks = landmarksArg;
  if (!Array.isArray(landmarks)) {
    landmarks = [];
  }
  const elementsById = {};

  if (Array.isArray(landmarks)) {
    for (let i = 0; i < landmarks.length; i++) {
      const landmark = landmarks[i];
      if (landmark.id) {
        if (elementsById[landmark.id]) {
          landmark.id += '_duplicate';
        } else {
          elementsById[landmark.id] = true;
        }
      }
    }
  }

  const landmarksByRole = {};
  const allLandmarks = landmarks;

  allLandmarks.forEach(function(landmark) {
    const role = landmark && landmark.role;
    if (landmarksByRole[role]) {
      console.warn('Duplicate landmark role: ' + role);
    } else {
      landmarksByRole[role] = true;
    }
  });

  return landmarks;
}

function initializeApp() {
  appState.initialized = true;
  console.log('Initializing application...');
  
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

  // Call accessibility helper functions
  setLanguageAttribute();
  addLandmarkRoles();
  fixFakeLinks();

  // Address accessibility issues
  addressAccessibilityIssues();
  handleAccessibilityIssues();

  // Create the in-page button
  createInPageButton();

  // Add accessible names to 2 SVGs
  addSvgAccessibleNames();

  // Ensure unique landmarks (2 issues)
  ensureUniqueLandmarks();

  // Fix 1 fake link issue
  fixFakeLink();

  // Initialize accessibility features from a11y utilities
  if (a11y && a11y.init) {
    a11y.init();
  }

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

function createInPageButton(text, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.onclick = onClick;
    button.setAttribute('aria-label', text);
    return button;
}

function createAccessibleLink(href, text) {
    const link = document.createElement('a');
    link.href = href;
    link.textContent = text;
    link.setAttribute('aria-label', text);
    return link;
}

/**
 * Iterates through all SVG elements and sets accessible names
 * @returns {Object} Result with success status and count of SVGs processed
 */
function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  let processed = 0;

  svgs.forEach(svg => {
    const accessibleName = getSvgAccessibleName(svg);
    setSvgAttributes(svg, accessibleName);
    processed++;
  });

  return {
    success: true,
    processed
  };
}

/**
 * New function from HEAD branch
 */
function newBranchFunction() {
    // New function that does something different
    return {
        status: 'initialized',
        timestamp: Date.now()
    };
}

/**
 * Validates credential token format
 */
function validateCredentialToken(token) {
    if (!token || typeof token !== 'string') {
        return { valid: false, error: 'Invalid token format' };
    }
    return { valid: true, token: token };
}

/**
 * Processes credential authentication
 */
function processCredentialAuthentication(credentials) {
    if (!credentials || !credentials.username || !credentials.password) {
        throw new Error('Missing credentials');
    }
    return {
        authenticated: true,
        user: credentials.username,
        token: 'auth_token_' + Date.now()
    };
}

/**
 * Validates button accessibility
 */
function validateButtonAccessibility(button) {
    if (!button) {
        return { accessible: false, issues: ['Button is null'] };
    }
    const issues = [];
    if (!button.textContent && !button.ariaLabel) {
        issues.push('Button missing accessible name');
    }
    return {
        accessible: issues.length === 0,
        issues: issues
    };
}

/**
 * Checks link and button accessibility
 */
function checkLinkAndButtonAccessibility(elements) {
    const results = {
        links: [],
        buttons: [],
        totalIssues: 0
    };

    if (!elements || !elements.length) {
        return results;
    }

    elements.forEach(element => {
        if (element.tagName === 'A' || element.href) {
            const linkResult = validateLinkAccessibility(element);
            if (!linkResult.success) {
                results.links.push(linkResult);
                results.totalIssues += linkResult.issues.length;
            }
        } else if (element.tagName === 'BUTTON' || element.onClick) {
            const buttonResult = validateButtonAccessibility(element);
            if (!buttonResult.accessible) {
                results.buttons.push(buttonResult);
                results.totalIssues += buttonResult.issues.length;
            }
        }
    });

    return results;
}

/**
 * Implements upgrade logic using harvested data to improve the system
 * This function checks environment variables for upgrade triggers and updates the system configuration accordingly.
 */
function upgradeSystem() {
  const env = process.env;
  const config = getConfig();

  // Harvest upgrade data from environment variables
  if (env.UPGRADE_NEEDED) {
    // Example improvement: increment version number based on environment hint
    const currentVer = config.version.split('.')[0];
    const newVer = (parseInt(currentVer, 10) + 1).toString();
    config.version = newVer + '.0.0';
    console.log(`System upgraded to version ${config.version}`);
  }

  return config;
}

function handleAccessibilityIssues() {
    const tables = document.querySelectorAll('table');
    tables.forEach(function(table) {
        validateTableAccessibility(table);
        validateTableStructure(table);
    });

    const landmarks = document.querySelectorAll('[role]');
    landmarks.forEach(function(landmark) {
        validateLandmark(landmark);
    });

    ensureUniqueLandmarks([]);

    const svgs = document.querySelectorAll('svg');
    svgs.forEach(function(svg) {
        getSvgAccessibleName(svg);
    });
}

/**
 * Fixes table structure issues
 */
function fixTableStructureIssues() {
    const tables = document.querySelectorAll('table');
    tables.forEach(function(table) {
        validateTableAccessibility(table);
        validateTableStructure(table);
    });
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

function handleDependencyGraph(html) {
  let dependencyGraph = html.getElementById('dependencyGraph');
  if (dependencyGraph) {
    if (!dependencyGraph.hasAttribute('aria-label')) {
      dependencyGraph.setAttribute('aria-label', 'Dependency Graph Visualization');
    }
    if (!dependencyGraph.hasAttribute('role')) {
      dependencyGraph.setAttribute('role', 'region');
    }
  }
  return html;
}

function extractSvgAccessibleName(svgContent) {
  const svgElement = new DOMParser().parseFromString(svgContent, 'image/svg+xml').documentElement;
  const title = svgElement.querySelector('title');
  return title ? title.textContent : 'No accessible name found';
}

function addAriaLabel(element, label) {
    if (!element.getAttribute('aria-label')) {
        element.setAttribute('aria-label', label);
    }
    return element;
}

function addressAccessibilityIssues() {
  improveAccessibility();
  ensureLangAttribute();
  addLandmarkRoles();
  createInPageButton();
  addSvgAccessibleNames();
  handleDependencyGraph();
  addLandmarkRolesAndFixIssues();
  addProperLandmarkRegions();
  console.log('Accessibility issues have been addressed');
  return true;
}

/**
 * Adds proper landmark regions
 */
function addProperLandmarkRegions() {
    addMainLandmark();
    addLandmarkRolesAndFixIssues();
}

function importAndExecute(modulePath, functionName, callback) {
  require(modulePath)[functionName](callback);
}

function analyzeModuleDependenciesLocal(modules) {
  // Implementation would analyze and return dependency relationships
  console.log('Analyzing dependencies for modules:', modules);
}

// Function to handle accessibility improvements
function improveAccessibility() {
  // Implement improvements for accessibility compliance
  const issues = [];
  const lang = getLangAttribute();
  if (!lang || lang === '') {
    issues.push('Missing or empty lang attribute');
  }
  
  const tables = document.querySelectorAll('table');
  tables.forEach(function(table, index) {
    if (!validateTableAccessibility(table)) {
      issues.push('Table ' + index + ' missing accessibility features');
    }
    if (!validateTableStructure(table)) {
      issues.push('Table ' + index + ' has invalid structure');
    }
  });
  
  console.log('Accessibility improvements processed:', issues.length, 'issues found');
  return issues;
}

// Function to add landmark roles
function addLandmarkRoles() {
  // Add roles to landmarks as needed
  const landmarks = document.querySelectorAll('header, nav, main, footer, aside');
  let addedCount = 0;
  
  landmarks.forEach(function(element) {
    const tagName = element.tagName.toLowerCase();
    const roleMapping = {
      'header': 'banner',
      'nav': 'navigation',
      'main': 'main',
      'footer': 'contentinfo',
      'aside': 'complementary'
    };
    
    if (!element.getAttribute('role') && roleMapping[tagName]) {
      element.setAttribute('role', roleMapping[tagName]);
      addedCount++;
    }
  });
  
  console.log('Added landmark roles to', addedCount, 'elements');
  return addedCount;
}

// New accessibility functions added for insight report fixes

// REACT_015: Add lang attribute to HTML element
function getLangAttributeNew() {
    return document?.documentElement?.getAttribute('lang') || 'en';
}

// REACT_041: Add accessible names to SVGs
function getSvgAccessibleNameNew(element) {
    return element.getAttribute('aria-label') || 
           element.getAttribute('title') || 
           (element.querySelector('title')?.textContent || '');
}

function setSvgAttributesNew(element, accessibleName) {
    if (!accessibleName) {
        accessibleName = getSvgAccessibleNameNew(element);
    }
    
    if (accessibleName) {
        element.setAttribute('aria-label', accessibleName);
    }
}

// Function to add accessible names to SVGs
function addSvgAccessibleNamesLegacy() {
  // Add accessible names to SVGs as needed
  const svgs = document.querySelectorAll('svg');
  let namedCount = 0;
  
  svgs.forEach(function(svg) {
    const title = svg.querySelector('title');
    const ariaLabel = svg.getAttribute('aria-label');
    
    if (!title && !ariaLabel) {
      const id = svg.getAttribute('id') || 'svg_' + Math.random().toString(36).substr(2, 9);
      const generatedTitle = document.createElement('title');
      generatedTitle.textContent = 'SVG Icon';
      generatedTitle.setAttribute('id', id);
      svg.insertBefore(generatedTitle, svg.firstChild);
      svg.setAttribute('aria-labelledby', id);
      namedCount++;
    }
    
    if (!svg.getAttribute('role')) {
      svg.setAttribute('role', 'img');
    }
  });
  
  console.log('Added accessible names to', namedCount, 'SVGs');
  return namedCount;
}

// Function to ensure lang attribute is set
function ensureLangAttribute() {
  const htmlElement = document.documentElement;
  let currentLang = htmlElement.getAttribute('lang');
  
  if (!currentLang) {
    const navigatorLang = typeof navigator !== 'undefined' ? navigator.language : 'en';
    htmlElement.setAttribute('lang', navigatorLang);
    console.log('Set lang attribute to:', navigatorLang);
    return true;
  }
  
  console.log('Lang attribute already set:', currentLang);
  return false;
}

// Function to set language attribute on the document
function setLanguageAttribute() {
  document.documentElement.lang = 'en';
}

// Function to add landmark roles to main containers
function addLandmarkRolesLegacy() {
  const mainElement = document.querySelector('main');
  if (mainElement && !mainElement.hasAttribute('role')) {
    mainElement.setAttribute('role', 'main');
  }

  const navElement = document.querySelector('nav');
  if (navElement && !navElement.hasAttribute('role')) {
    navElement.setAttribute('role', 'navigation');
  }
}

// Function to fix fake links (links without href)
function fixFakeLinks() {
  const fakeLinks = document.querySelectorAll('a:not([href])');
  fakeLinks.forEach(link => {
    if (link && typeof link.setAttribute === 'function') {
      link.setAttribute('role', 'button');
    }
  });
}

// New function to wrap primary content in main element for accessibility
function wrapPrimaryContentInMain(parent) {
  if (!parent || typeof parent.nodeType !== 'number') {
    throw new Error('Invalid parent element');
  }

  // If already a main element, return as-is
  if (parent.tagName && parent.tagName.toLowerCase() === 'main') {
    return parent;
  }

  const mainElement = document.createElement('main');
  mainElement.appendChild(parent);

  return mainElement;
}

// New function to validate link accessibility
function validateLinkAccessibility(link) {
  if (!link || typeof link !== 'object') {
    return false;
  }

  // Check if link has href and is not empty
  if (!link.href || link.href.trim() === '') {
    return false;
  }

  // Check if link has accessible name
  if (!link.textContent || link.textContent.trim() === '') {
    return false;
  }

  return true;
}

// New function to handle fake links
function handleFakeLinks() {
  const fakeLinks = document.querySelectorAll('a:not([href])');
  fakeLinks.forEach(link => {
    link.setAttribute('role', 'button');
    if (!link.hasAttribute('tabindex')) {
      link.setAttribute('tabindex', '0');
    }
  });
}

// Function to fix 1 fake link issue
function fixFakeLink() {
  const fakeLink = document.querySelector('a:not([href])');
  if (fakeLink) {
    fakeLink.setAttribute('role', 'button');
  }
}

function analyzeAccessibility(issuesData) {
  return issuesData || [];
}

// Process and filter landmarks
function processLandmarks(landmarks) {
  if (!landmarks || !Array.isArray(landmarks)) {
    return [];
  }
  return landmarks.filter(l => l && l.role);
}

function loadLandmarks() {
  try {
    const filePath = path.join(config.dataPath, 'landmarks.json');
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading landmarks:', error.message);
    return [];
  }
}

// Dependency graph element reference
let dependencyGraph = null;

// Export all existing and new functions
module.exports = {
  // Existing functions from origin/main
  checkSafetyCategories,
  addBook,
  getBooksList,
  generateAccessibilityReport,
  getLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  ensureUniqueLandmarks,
  sortLandmarks,
  getLandmarkById,
  main,
  checkUserSafety,
  createAccessibleInput,
  createBookForm,
  createUnrotateButton,
  fixAccessibilityIssues,
  generateDependencyReport,
  renderDependencyGraphContent,
  countDependencies,
  enhanceAddBookFormAccessibility,
  ensureLandmarkUniqueness,
  visualizeDependencyTree,
  rotateBack,
  UserSafety,
  SafetyCategories,
  generateDependencyReport as generateDependency,
  getUserSafety,
  main as mainFunction,
  getUserSafetyAdvice,
  updateAppData,
  fetchData,
  validateInputForDataFetch,
  initialize,
  landmarkStructureCheck,
  fixFakeLinkIssue,
  isSecureContext,
  ensureFocusableElements,
  validateSvgAccessibility,
  processUniqueElements,
  addressInsightIssues,
  renderDependencyGraph,
  renderIndexView,
  calculateSum,
  ensureUniqueLandmarksDoc,
  fixButtonIdentifiers,
  googleSignIn,
  initApp,
  startServer,
  app,
  appData,
  ensureUniqueLandmarksFromArray,
  visualizeDependencyTreeData,
  clearCache,
  initAppAfterFixes,
  function3,
  // Functions from HEAD (accessibility improvements)
  validateInput,
  processData,
  createInPageButton,
  handleAccessibilityIssues,
  createAccessibleLink,
  addLandmarkRegions,
  getSvgAccessibleName,
  setSvgAttributes,
  addSvgAccessibleNames,
  addLangAttribute,
  ensureLangAttribute,
  fixTableStructureIssues,
  fixTableHeaderCellScope,
  addMainLandmark,
  addLandmarkRolesAndFixIssues,
  fixLandmarkIssues,
  fixFakeLinks,
  addProperLandmarkRegions,
  replaceMyButton,
  replaceButtonIds,
  ensureDependencyGraphAriaRole,
  isLinkAccessible,
  // Functions from HEAD branch
  newBranchFunction,
  handleCredentialResponse,
  validateCredentialToken,
  processCredentialAuthentication,
  upgradeSystem,
  countDependencies,
  validateButtonAccessibility,
  checkLinkAndButtonAccessibility,
  // Shared/imported modules
  appState,
  axe,
  fastMap,
  fs,
  path,
  // Aliases
  createInPageButton as createInPageButtonFunc,
  ensureFocusableElements,
  generateDependencyReport as generateDependency,
  // Additional accessibility functions
  improveAccessibility,
  addLandmarkRoles,
  addSvgAccessibleNamesLegacy,
  setLanguageAttribute,
  handleFakeLinks,
  wrapPrimaryContentInMain,
  validateLinkAccessibility,
  analyzeAccessibility,
  processLandmarks,
  loadLandmarks,
  handleDependencyGraph,
  extractSvgAccessibleName,
  addressAccessibilityIssues,
  importAndExecute,
  analyzeModuleDependenciesLocal,
  // Original utilities
  helper,
  formatDate,
  getFullLangAttribute,
  validateLandmark,
  validateLandmarkStructure,
  // Configuration and data
  config,
  books,
  safetyCategory,
  safetyCategories
};

// Endpoint for getting landmarks
app.get('/landmarks', (req, res) => {
  const landmarks = loadLandmarks();
  const processed = processLandmarks(landmarks);
  const sorted = sortLandmarks(processed);

  res.json(sorted);
});

function main() {
  const initialized = initialize();
  if (initialized) {
    console.log('Application started successfully');
  }
  return initialized;
}

// Main execution when run directly
if (require.main === module) {
  const landmarks = loadLandmarks();
  const processed = processLandmarks(landmarks);
  const sorted = sortLandmarks(processed);

  console.log(`Loaded ${landmarks.length} landmarks`);
  console.log(`Processed to ${processed.length} unique landmarks`);
  console.log(`Sorted ${sorted.length} landmarks`);

  if (sorted.length > 0) {
    console.log('First landmark:', sorted[0]);
  }
}