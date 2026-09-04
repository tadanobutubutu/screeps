const express = require('express');
const fs = require('fs');
const path = require('path');
const fastMap = require('fast-map');
const accessiblyHelper = require('./accessibly-helper');
const axe = require('axe-core');

// Application state
let isAppInitialized = false;
const appData = {};

// Configuration
const CONFIG = {
  outputPath: './data',
  maxResults: 100,
  apiUrl: process.env.API_URL || '',
  timeout: 5000
};

const LANDMARK_CONFIG = {
  dataPath: './data',
  maxResults: 100
};

// Express server setup
const app = express();
app.use(express.static('public'));

// Module relationships
let dependencyGraph = {};
const modules = [];

// Routes
app.get('/index', (req, res) => {
  res.send(indexContent);
});

app.get('/dependency_graph', (req, res) => {
  res.send(getDependencyGraph());
});

app.get('/graph', (req, res) => {
  const graph = visualizeModuleRelationships(modules);
  res.json(graph);
});

app.post('/analyze', async (req, res) => {
  try {
    const moduleIds = req.body.modules;
    const results = await analyzeModuleDependencies(moduleIds);
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred during analysis.' });
  }
});

// Server startup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  initialise();
});

// Module analysis functions
function visualizeModuleRelationships(modules) {
  // Implementation to be added
  return { modules: modules || [] };
}

function analyzeModuleDependencies(modules) {
  console.log('Analyzing dependencies for modules:', modules);
  // Implementation to be added
  return { dependencies: [] };
}

function getDependencyGraph() {
  if (Object.keys(dependencyGraph).length === 0) {
    return { message: "No dependency graph found." };
  }
  return dependencyGraph;
}

// Initialization function
function initialise() {
  // Initialisation logic
  isInitialized = true;
}

// Accessibility functions (merged and adapted)
function getLangAttribute() {
  return navigator.language || navigator.userLanguage;
}

function addLangAttribute() {
  const html = document.documentElement;
  html.setAttribute('lang', getLangAttribute());
}

function logCurrentURL() {
  console.log('Current URL: ' + window.location.href);
}

function validateTableAccessibility(table) {
  accessiblyHelper.validateTableAccessibility(table);
  return true;
}

function validateTableStructure(table) {
  accessiblyHelper.validateTableStructure(table);
  return true;
}

function fixTableStructure(table) {
  accessiblyHelper.fixTableStructure(table);
}

function fixTableAccessibility() {
  accessiblyHelper.fixTableAccessibility();
}

function addMainLandmark() {
  accessiblyHelper.addMainLandmark();
}

function validateLandmark(landmark) {
  return accessiblyHelper.validateLandmark(landmark);
}

function validateLandmarkStructure(landmark) {
  return accessiblyHelper.validateLandmarkStructure(landmark);
}

function validateLandmarkAttributes(landmark) {
  return accessiblyHelper.validateLandmarkAttributes(landmark);
}

function isValidLandmark(landmark) {
  return accessiblyHelper.isValidLandmark(landmark);
}

function loadLandmarks() {
  return accessiblyHelper.loadLandmarks();
}

function processLandmarks(landmarks) {
  return accessiblyHelper.processLandmarks(landmarks);
}

function sortLandmarks(landmarks, ascending = true) {
  return accessiblyHelper.sortLandmarks(landmarks, ascending);
}

function findLandmarkById(landmarks, id) {
  return accessiblyHelper.findLandmarkById(landmarks, id);
}

function ensureUniqueLandmarks(landmarks) {
  return accessiblyHelper.ensureUniqueLandmarks(landmarks);
}

// Accessibility report functions
function writeReport(report) {
  accessiblyHelper.writeReport(report);
}

function generateAccessibilityReport() {
  // Replacement for `processAccessibilityReport()`
  const report = accessiblyHelper.scanAccessibility();
  writeReport(report);
  return report;
}

// Additional helper functions
function ensureUniqueLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
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

// Axe-core scanning
function scanAccessibility() {
  // Replacement for `processAccessibilityReport()`
  const results = axe.run();
  return {
    timestamp: new Date().toISOString(),
    issues: results.violations || []
  };
}

// SVG accessibility helpers
function getSvgAccessibleName(svg) {
  return accessiblyHelper.getSvgAccessibleName(svg);
}

function setSvgAttributes(svg, name) {
  accessiblyHelper.setSvgAttributes(svg, name);
}

function getSvgRole(svgElement) {
  return accessiblyHelper.getSvgRole(svgElement);
}

// Link accessibility helpers
function createInPageButton(targetId, text) {
  return accessiblyHelper.createInPageButton(targetId, text);
}

function validateLinkAccessibility(link) {
  return accessiblyHelper.validateLinkAccessibility(link);
}

function handleFakeLinks() {
  const links = document.querySelectorAll('a[href="#"]');
  links.forEach(link => {
    accessiblyHelper.handleFakeLinks(link);
  });
}

// Landmark regions
function addLandmarkRegions() {
  accessiblyHelper.addLandmarkRegions();
}

function addProperLandmarkRegions() {
  accessiblyHelper.addProperLandmarkRegions();
}

/*
User Safety: unsafe
Response Safety: safe
Safety Categories: Other, Unauthorized Advice
*/

// Configuration
const CONFIG = {
  outputPath: './data',
  maxResults: 100,
  apiUrl: process.env.API_URL || '',
  timeout: 5000,
  dataPath: './data',
  // Add other configuration properties as needed
};

// Application state
let isAppInitialized = false;
let isInitialized = false;
const appData = { resources: [] };
const appState = {
  initialized: false,
  lastUpdate: null,
  cache: {}
};

// Example of how to export a required function from another file
// const { myFunction } = require('./otherFile');
// module.exports = { myFunction };
// TODO: Add back any required exports that might have been removed

// Address accessibility issues from insight report

// Import the required module
const { axe } = require('axe-core');
const express = require('express');
const fs = require('fs');
const fastMap = require('fast-map');
const path = require('path');

// Import other functions (removed duplicate local declarations to avoid redeclaration errors)
const { improveAccessibility, addressInsightReportIssues, renderDependencyGraph, renderIndexView, calculateSum, fixLandmarkIssues, addLandmarkRoles, ensureUniqueLandmarks, fixFakeLinks, fixTableStructureIssues, fixTableHeaderCellScope, addMainLandmark, addSvgAccessibleNames, implementNewFunction, addLangAttribute, main, someFunction, createInPageButtons, fixUniqueLandmarks, generateAccessibilityReport } = require('./');

// Import helper functions
const { validateInput, processData, formatResponse } = require('./utils/validators');
const { getSvgAccessibleName, setSvgAttributes } = require('./utils/svg');

// Address accessibility issues from insight report
function addressAccessibilityIssues() {
  // Ensure the dependencyGraph container has a proper ARIA role
  // ... (Existing code preserved)

  // New function to add landmark roles and fix issues
  addLandmarkRoles(insightReport());

  // New function for creating in-page buttons
  createInPageButtons(buttonElements, containerSelector);

  // Fix unique landmarks based on insight report (REACT_025)
  fixUniqueLandmarks(insightReport());

  // Utilities
  const accessibilityScanner = axe.createInstance({
    rules: {
      'color-contrast': { enabled: false }, // Disable this rule if not needed
      'aria-roles': { enabled: false }, // Disable this rule if not needed
      'aria-properties': { enabled: false }, // Disable this rule if not needed
      // Add any custom rules you want to use here
    }
  });

  async function scanAccessibility() {
    const rootElement = document.querySelector('html');
    const results = await accessibilityScanner.analyze(rootElement);

    if (results.violations.length > 0) {
      console.warn('Accessibility issues found:', results);

      // You can implement custom handling for accessibility issues here
      // For example, create an accessibility report or perform fixes automatically

      // Generate an accessibility report based on scan results
      const accessibilityReport = generateAccessibilityReport(results);
      // Save the report to a file or send it elsewhere
    }
  }

  return scanAccessibility();
}

// Render dependency graph content
function renderDependencyGraphContent(data) {
  // Replace the existing content within the dependencyGraph div using the provided data.
  renderDependencyGraph(data);
}

// Import helper functions from utils
const {
  validateInput,
  processData,
  formatResponse
} = require('./utils');
const {
  getSvgAccessibleName,
  setSvgAttributes
} = require('./helpers');

// Import validators from utils/validators
const {
  validateTableAccessibility,
  validateTableStructure,
  fixTableStructure,
  validateLandmark,
  validateLandmarkAttributes,
  validateLandmarkStructure,
  isValidLandmark: isValidLandmarkFromUtils,
  loadLandmarks: loadLandmarksFromUtils,
  processLandmarks: processLandmarksFromUtils,
  sortLandmarks: sortLandmarksFromUtils,
  findLandmarkById: findLandmarkByIdFromUtils,
  ensureUniqueLandmarks: ensureUniqueLandmarksFromUtils,
  writeReport: writeReportFromUtils,
  generateAccessibilityReport: generateAccessibilityReportFromUtils,
  validateItem,
  addLangAttribute: addLangAttributeFromUtils,
  logCurrentURL,
  createInPageButtons: createInPageButtonsFromUtils
} = require('./utils/validators');

// User Safety: unsafe
// Safety Categories: Other, Unauthorized Advice, Needs Caution

/**
 * Gets the lang attribute for the HTML element
 * @returns {string} The lang attribute value
 */
function getLangAttribute() {
    return navigator.language || navigator.userLanguage;
}

// Adding lang attribute to HTML element
function addLangAttribute() {
    const htmlElement = document.documentElement;
    const lang = getLangAttribute();
    if (htmlElement && !htmlElement.lang) {
        htmlElement.setAttribute('lang', lang);
    }
}

// Logging the current URL
function logCurrentURL() {
    console.log('Current URL: ' + window.location.href);
}

// Table accessibility helpers
function validateTableAccessibility(table) {
    // Implementation to be added
}

function validateTableStructure(table) {
    // Implementation to be added
}

function fixTableStructure(table) {
    // Implementation to be added
}

// Landmark handling
function addMainLandmark() {
    // Implementation to be added
}

function validateLandmark(landmark) {
    const issues = [];
    if (!landmark) {
        return { valid: false, issues: ['Landmark is null or undefined'] };
    }
    if (typeof landmark.id !== 'string' || landmark.id.trim().length === 0) {
        return {
            valid: false,
            issues: ['Landmark ID is required and non-empty']
        };
    }
    return { valid: true, issues: [] };
}

function validateLandmarkStructure(landmark) {
    // Implement landmark structure validation here
}

function validateLandmarkAttributes(landmark) {
    // Implement landmark validation attributes here
}

function isValidLandmark(landmark) {
    return landmark &&
           typeof landmark.id !== 'undefined' &&
           landmark.id !== null;
}

function loadLandmarks() {
    try {
        const filePath = path.join(CONFIG.outputPath, 'landmarks.json');
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

function sortLandmarks(landmarks, ascending = true) {
    return landmarks.sort((a, b) => {
        const nameA = (a.name || '').toLowerCase();
        const nameB = (b.name || '').toLowerCase();
        if (ascending) {
            return nameA.localeCompare(nameB);
        }
        return nameB.localeCompare(nameA);
    });
}

function findLandmarkById(id) {
    const landmarks = loadLandmarks();
    return landmarks.find(landmark => landmark.id === id) || null;
}

function ensureUniqueLandmarks(landmarks) {
    if (!Array.isArray(landmarks)) {
        return [];
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

// Function to write the generated report to a file
function writeReport(report) {
    const reportFile = path.join(CONFIG.outputPath, 'accessibility-report.json');
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
}

/**
 * REACT_036: Create accessible links
 * Creates properly accessible links and buttons
 */
function createAccessibleLinks() {
    const skipLink = createInPageButton('main-content', 'Skip to main content');
    document.body.prepend(skipLink);
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        const validation = validateLinkAccessibility(link);
        if (!validation.valid) {
            console.warn('Link validation issues:', validation.issues);
        }
    });
}

// TODO: Implement function for generating a report based on accessibility issues
function generateAccessibilityReport() {
    const report = scanAccessibility();
    writeReport(report);
    return report;
}

/**
 * function3 - Process and validate accessibility data with specific rules
 * @param {Object} data - The data object to process
 * @param {string} data.type - The type of accessibility check
 * @param {Array} data.items - Array of items to validate
 * @param {Object} options - Additional processing options
 * @param {boolean} options.strict - Enable strict validation mode
 * @param {string} options.format - Output format ('array', 'object', 'filtered')
 * @returns {Object|Array} Processed accessibility data
 */
function function3(data, options = {}) {
    const { strict = false, format = 'object' } = options;
    if (!data || typeof data !== 'object') {
        throw new Error('Invalid data: expected an object');
    }
    const { type, items = [] } = data;
    if (!type || typeof type !== 'string') {
        throw new Error('Invalid type: expected a non-empty string');
    }
    if (!Array.isArray(items)) {
        throw new Error('Invalid items: expected an array');
    }
    const results = {
        type,
        timestamp: new Date().toISOString(),
        processedCount: 0,
        validItems: [],
        invalidItems: [],
        metadata: {
            strictMode: strict,
            format: format
        }
    };
    items.forEach((item, index) => {
        const validation = validateItem(item, type, strict);
        if (validation.valid) {
            results.validItems.push({
                index,
                data: item,
                validation: validation.details
            });
        } else {
            results.invalidItems.push({
                index,
                data: item,
                errors: validation.errors
            });
        }
        results.processedCount++;
    });
    switch (format) {
        case 'array':
            return results.validItems;
        case 'filtered':
            return results.invalidItems;
        case 'object':
        default:
            return results;
    }
}

/**
 * Validate a single item based on type and strict mode
 * @param {Object} item - Item to validate
 * @param {string} type - Type of accessibility check
 * @param {boolean} strict - Enable strict validation
 * @returns {Object} Validation result
 */
function validateItem(item, type, strict) {
    const errors = [];
    const details = {};
    if (!item || typeof item !== 'object') {
        errors.push('Item must be a valid object');
        return { valid: false, errors };
    }
    switch (type) {
        case 'landmark':
            if (!item.id || typeof item.id !== 'string') {
                errors.push('Landmark must have a valid id');
            } else {
                details.id = item.id;
            }
            if (!item.role && strict) {
                errors.push('Landmark must have a role');
            } else if (item.role) {
                details.role = item.role;
            }
            break;
        case 'table':
            if (!item.tagName || item.tagName.toLowerCase() !== 'table') {
                errors.push('Element must be a table');
            } else {
                details.tagName = item.tagName;
            }
            if (!item.caption && strict) {
                errors.push('Table should have a caption');
            } else if (item.caption) {
                details.caption = item.caption;
            }
            break;
        case 'svg':
            if (!item.tagName || item.tagName.toLowerCase() !== 'svg') {
                errors.push('Element must be an SVG');
            } else {
                details.tagName = item.tagName;
            }
            if (!item.accessibleName && strict) {
                errors.push('SVG should have an accessible name');
            } else if (item.accessibleName) {
                details.accessibleName = item.accessibleName;
            }
            break;
        case 'link':
            if (!item.href && strict) {
                errors.push('Link should have a valid href');
            } else if (item.href) {
                details.href = item.href;
            }
            if (!item.textContent && !item['aria-label'] && strict) {
                errors.push('Link should have text content or aria-label');
            } else {
                details.textContent = item.textContent || item['aria-label'];
            }
            break;
        default:
            if (!item.id) {
                errors.push('Item must have an id');
            } else {
                details.id = item.id;
            }
    }
    return {
        valid: errors.length === 0,
        errors,
        details
    };
}

// Improve accessibility
function improveAccessibility() {
  accessiblyHelper.improveAccessibility();
}

async function fetchUser(id) {
  return new Promise((resolve, reject) => {
    const options = {
      url: CONFIG.apiUrl + '/users/' + id,
      timeout: CONFIG.timeout
    };

    if (options.url) {
      resolve({ id, name: 'User ' + id });
    } else {
      reject(new Error('Failed to fetch user: Invalid URL'));
    }
  });
}

function clearCache() {
  // Implement cache clearing logic
}

module.exports = {
  app,
  visualizeModuleRelationships,
  analyzeModuleDependencies,
  getDependencyGraph,
  initialise,
  getLangAttribute,
  addLangAttribute,
  logCurrentURL,
  validateTableAccessibility,
  validateTableStructure,
  fixTableStructure,
  fixTableAccessibility,
  addMainLandmark,
  validateLandmark,
  validateLandmarkStructure,
  validateLandmarkAttributes,
  isValidLandmark,
  loadLandmarks,
  processLandmarks,
  sortLandmarks,
  getLandmarkById,
  ensureUniqueLandmarks,
  writeReport,
  generateAccessibilityReport,
  createInPageButton,
  validateLinkAccessibility,
  handleFakeLinks,
  addLandmarkRegions,
  addProperLandmarkRegions,
  improveAccessibility,
  fetchUser,
  clearCache
};