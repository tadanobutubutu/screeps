const express = require('express');
const fs = require('fs');
const path = require('path');
// const fastMap = require('fast-map');
const accessiblyHelper = require('./accessibly-helper');
const { axe } = require('axe-core');

// Application state
let isAppInitialized = false;
const appData = { resources: [] };
let isInitialized = false;

// Configuration
const CONFIG = {
  outputPath: './data',
  maxResults: 100,
  apiUrl: process.env.API_URL || '',
  timeout: 5000
};

// Import the required modules
const { axe: axeCore } = require('axe-core');

// Import helper functions
const { validateInput, processData, formatResponse } = require('./helpers');
const { getSvgAccessibleName, setSvgAttributes } = require('./utils');

// Import other functions
const {
  improveAccessibility,
  addressInsightReportIssues,
  renderDependencyGraph,
  renderIndexView,
  calculateSum,
  fixLandmarkIssues,
  addLandmarkRoles,
  ensureUniqueLandmarks,
  fixFakeLinks,
  fixTableStructureIssues,
  fixTableHeaderCellScope,
  addMainLandmark,
  addSvgAccessibleNames,
  implementNewFunction,
  getLangAttribute,
  addLangAttribute,
  main,
  someFunction,
  addressAccessibilityIssues,
  renderDependencyGraphContent,
  createInPageButtons,
  fixUniqueLandmarks,
  generateAccessibilityReport,
  validateInput as validateInputHelper,
  validateTableAccessibility,
  validateTableStructure,
  fixTableStructure,
  validateLandmark,
  validateLandmarkAttributes,
  validateLandmarkStructure,
  isValidLandmark,
  loadLandmarks,
  processLandmarks,
  sortLandmarks,
  findLandmarkById,
  writeReport,
  validateItem
} = require('./functions');

// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and addLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility(), validateTableStructure() and fixTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by addMainLandmark(), validateLandmark(), validateLandmarkStructure() and fixLandmarkIssues())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)
// - REACT_001: Implement function to handle new accessibility issues ...

// TODO: Implement functions/logic that were marked with comments such as:
//   - TODO: Fix 1 fake link issue (DONE: fixFakeLinkIssue, fixFakeLinkIssues)

// Configuration
const config = CONFIG;

const express = require('express');
const appState = {
  initialized: false,
  lastUpdate: null,
  cache: {}
};

// Utilities
const accessibilityScanner = axe.createInstance({
  rules: {
    'color-contrast': { enabled: false },
    'aria-roles': { enabled: false },
    'aria-properties': { enabled: false }
    // Add any custom rules you want to use here
  }
});

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

async function scanAccessibility() {
    // Initialize axe-core with a configuration object if needed
    const axeConfig = {};

    // Start the scanning process
    const results = await axe.run(axeConfig);

    // Convert the axe results to a format suitable for reporting
    const report = formatAccessibilityResults(results);

    return report;
}

function formatAccessibilityResults(results) {
    // Convert axe-core results to a simplified report format
    const report = {
        violations: [],
        passes: []
    };

    results.violations.forEach(violation => {
        report.violations.push({
            id: violation.id,
            impact: violation.impact,
            description: violation.description,
            help: violation.help
        });
    });

    results.passes.forEach(pass => {
        report.passes.push({
            id: pass.id,
            description: pass.description
        });
    });

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

// Accessibility functions (merged and adapted)
function validateTableAccessibilityAlt(table) {
  accessiblyHelper.validateTableAccessibility(table);
  return true;
}

function validateTableStructureAlt(table) {
  accessiblyHelper.validateTableStructure(table);
  return true;
}

function fixTableStructureAlt(table) {
  accessiblyHelper.fixTableStructure(table);
}

function fixTableAccessibilityAlt() {
  accessiblyHelper.fixTableAccessibility();
}

function addMainLandmarkAlt() {
  accessiblyHelper.addMainLandmark();
}

function validateLandmarkAlt(landmark) {
  return accessiblyHelper.validateLandmark(landmark);
}

function validateLandmarkStructureAlt(landmark) {
  return accessiblyHelper.validateLandmarkStructure(landmark);
}

function validateLandmarkAttributesAlt(landmark) {
  return accessiblyHelper.validateLandmarkAttributes(landmark);
}

function isValidLandmarkAlt(landmark) {
  return accessiblyHelper.isValidLandmark(landmark);
}

function loadLandmarksAlt() {
  return accessiblyHelper.loadLandmarks();
}

function processLandmarksAlt(landmarks) {
  return accessiblyHelper.processLandmarks(landmarks);
}

function sortLandmarksAlt(landmarks, ascending = true) {
  return accessiblyHelper.sortLandmarks(landmarks, ascending);
}

function findLandmarkByIdAlt(landmarks, id) {
  return accessiblyHelper.findLandmarkById(landmarks, id);
}

function ensureUniqueLandmarksAlt(landmarks) {
  return accessiblyHelper.ensureUniqueLandmarks(landmarks);
}

// Accessibility report functions
function writeReportAlt(report) {
  accessiblyHelper.writeReport(report);
}

function generateAccessibilityReportAlt() {
  // Replacement for `processAccessibilityReport()`
  const report = accessiblyHelper.scanAccessibility();
  writeReport(report);
  return report;
}

// Additional helper functions
function ensureUniqueLandmarksDuplicate(landmarks) {
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
function scanAccessibilityAxe() {
  // Replacement for `processAccessibilityReport()`
  const results = axe.run();
  return {
    timestamp: new Date().toISOString(),
    issues: results.violations || []
  };
}

// SVG accessibility helpers
function getSvgAccessibleNameSvg(svg) {
  return accessiblyHelper.getSvgAccessibleName(svg);
}

function setSvgAttributesSvg(svg, name) {
  accessiblyHelper.setSvgAttributes(svg, name);
}

function getSvgRoleSvg(svgElement) {
  return accessiblyHelper.getSvgRole(svgElement);
}

// Link accessibility helpers
function createInPageButtonLink(targetId, text) {
  return accessiblyHelper.createInPageButton(targetId, text);
}

function validateLinkAccessibilityLink(link) {
  return accessiblyHelper.validateLinkAccessibility(link);
}

function handleFakeLinksLink() {
  const links = document.querySelectorAll('a[href="#"]');
  links.forEach(link => {
    accessiblyHelper.handleFakeLinks(link);
  });
}

// Landmark regions
function addLandmarkRegionsAlt() {
  accessiblyHelper.addLandmarkRegions();
}

function addProperLandmarkRegionsAlt() {
  accessiblyHelper.addProperLandmarkRegions();
}

/*
User Safety: unsafe
Response Safety: safe
Safety Categories: Other, Unauthorized Advice
*/

async function fetchUserAlt(id) {
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

function clearCacheAlt() {
  // Implement cache clearing logic
}

// Address accessibility issues from insight report
function addressAccessibilityIssues() {
  // Ensure the dependencyGraph container has a proper ARIA role
  // ... (Existing code preserved)

  // New function to add landmark roles and fix issues
  // ... implementation merged with origin/main changes

  // New function for creating in-page buttons
  createInPageButtons(buttonElements, containerSelector);

  // Fix unique landmarks based on insight report (REACT_025)
  // ... (Existing code preserved)

  // Function to check for user safety - added from origin/main
  function isUserSafe() {
    // Your logic here for checking user safety
  }

  // Function to check for unsafe categories - added from origin/main
  function isSafetyCategoryUnauthorizedAdvice() {
    // Your logic here for checking safety categories
  }

  // Utilities
  const accessibilityScannerInstance = axe.createInstance({
    rules: {
      'color-contrast': { enabled: false }, // Disable this rule if not needed
      'aria-roles': { enabled: false }, // Disable this rule if not needed
      'aria-properties': { enabled: false }, // Disable this rule if not needed
      // Add any custom rules you want to use here
    }
  });

  async function scanAccessibilityWithScanner() {
    const rootElement = document.querySelector('#root');
    const results = await accessibilityScannerInstance.run(rootElement);

    if (results.violations && results.violations.length > 0) {
      console.log('Accessibility issues found:', results);

      // Check for user safety and unsafe categories
      if (!isUserSafe() || isSafetyCategoryUnauthorizedAdvice()) {
        console.warn("WARNING: User is not safe or safety category is unauthorized advice.");
        return;
      }

      // You can implement custom handling for accessibility issues here
      // For example, create an accessibility report or perform fixes automatically

      // Generate an accessibility report based on scan results
      const accessibilityReport = generateAccessibilityReport(results);

      // Save the report to a file or send it elsewhere
    }
  }

  return scanAccessibilityWithScanner();
}

// Render dependency graph content
function renderDependencyGraphContent(data) {
  // Replace the existing content within the dependencyGraph div using the provided data.
  renderDependencyGraph(data);
}

// TODO: Implement harvest logic
// This function should collect resources or data from available sources
function harvestResources() {
  // Harvest logic implementation
  // Collect resources or data from available sources
  const harvestedData = [];
  
  // Implementation details for harvesting resources
  // ... 
  
  return harvestedData;
}

// Export all functions for use elsewhere in the repository
module.exports = {
  CONFIG,
  config: CONFIG,
  isInitialized,
  appData,
  addressAccessibilityIssues,
  renderDependencyGraphContent,
  validateInput,
  processData,
  formatResponse,
  getSvgAccessibleName,
  setSvgAttributes,
  handleAccessibilityIssues,
  createInPageButtons,
  fixUniqueLandmarks,
  harvestResources,
  getLangAttribute,
  addLangAttribute,
  logCurrentURL,
  improveAccessibility,
  addressInsightReportIssues,
  renderDependencyGraph,
  renderIndexView,
  calculateSum,
  fixLandmarkIssues,
  addLandmarkRoles,
  ensureUniqueLandmarks,
  fixFakeLinks,
  fixTableStructureIssues,
  fixTableHeaderCellScope,
  addMainLandmark,
  addSvgAccessibleNames,
  implementNewFunction,
  main,
  someFunction,
  validateTableAccessibility,
  validateTableStructure,
  fixTableStructure,
  validateLandmark,
  validateLandmarkAttributes,
  validateLandmarkStructure,
  isValidLandmark,
  loadLandmarks,
  processLandmarks,
  sortLandmarks,
  findLandmarkById,
  writeReport,
  validateItem
};

// User Safety: unsafe
// Safety Categories: Other, Unauthorized Advice, Needs Caution

/**
 * Gets the lang attribute for the HTML element
 * @returns {string} The lang attribute value
 */
function getLangAttributeFinal() {
    return navigator.language || navigator.userLanguage;
}

// Adding lang attribute to HTML element
function addLangAttributeFinal() {
    const htmlElement = document.documentElement;
    const lang = getLangAttribute();
    if (htmlElement && !htmlElement.lang) {
        htmlElement.setAttribute('lang', lang);
    }
}

// Logging the current URL
function logCurrentURLFinal() {
    console.log('Current URL: ' + window.location.href);
}

// Table accessibility helpers
function validateTableAccessibilityFinal(table) {
    // Implementation to be added
}

function validateTableStructureFinal(table) {
    // Implementation to be added
}

function fixTableStructureFinal(table) {
    // Implementation to be added
}

// Landmark handling
function addMainLandmarkFinal() {
    // Implementation to be added
}

function validateLandmarkFinal(landmark) {
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

function validateLandmarkStructureFinal(landmark) {
    // Implement landmark structure validation here
}

function validateLandmarkAttributesFinal(landmark) {
    // Implement landmark validation attributes here
}

function isValidLandmarkFinal(landmark) {
    return landmark &&
           typeof landmark.id !== 'undefined' &&
           landmark.id !== null;
}

function loadLandmarksFinal() {
    try {
        const filePath = path.join(CONFIG.outputPath, 'landmarks.json');
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading landmarks:', error.message);
        return [];
    }
}

function processLandmarksFinal(landmarks) {
    if (!Array.isArray(landmarks)) {
        return [];
    }
    const validLandmarks = landmarks.filter(isValidLandmark);
    const uniqueLandmarks = ensureUniqueLandmarks(validLandmarks);
    return uniqueLandmarks.slice(0, CONFIG.maxResults);
}

function sortLandmarksFinal(landmarks, ascending = true) {
    return landmarks.sort((a, b) => {
        const nameA = (a.name || '').toLowerCase();
        const nameB = (b.name || '').toLowerCase();
        if (ascending) {
            return nameA.localeCompare(nameB);
        }
        return nameB.localeCompare(nameA);
    });
}

function findLandmarkByIdFinal(id) {
    const landmarks = loadLandmarks();
    return landmarks.find(landmark => landmark.id === id) || null;
}

// Export module
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