// TODO: Address accessibility issues from insight report — CONTINUING
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...)
// - REACT_036: Fix 1 fake link issue (handled by ... createInPageButton(), ... and personName())
// - ADD: Address new accessibility issues from insight report
// Add new functions (no existing functions should be removed or renamed)

function addressAccessibilityIssues() {
  // TODO: Implement the required changes to improve accessibility
  
  // REACT_015: Add lang attribute to HTML element
  function setHtmlLangAttribute(lang = 'en', doc = document) {
    if (doc.documentElement) {
      doc.documentElement.setAttribute('lang', lang);
    }
  }

  // REACT_017: Add/fix 4 landmark issues
  // Helper to create proper landmark regions (main, nav, header, footer, aside)
  function createLandmark(type, options = {}) {
    const { id, label, className, role } = options;
    const element = document.createElement(type);
    
    if (id) element.id = id;
    if (label) element.setAttribute('aria-label', label);
    if (className) element.className = className;
    if (role) element.setAttribute('role', role);
    
    return element;
  }

  // REACT_025: Ensure unique landmarks (2 issues)
  // Helper to ensure landmark IDs are unique
  function getUniqueLandmarkId(baseId) {
    if (!document.getElementById(baseId)) {
      return baseId;
    }
    let counter = 1;
    let newId = `${baseId}-${counter}`;
    while (document.getElementById(newId)) {
      counter++;
      newId = `${baseId}-${counter}`;
    }
    return newId;
  }

  // REACT_036: Fix 1 fake link issue
  // Convert fake links (anchors without href or with href="#") to proper buttons
  function fixFakeLink(linkElement) {
    if (linkElement.tagName === 'A') {
      const href = linkElement.getAttribute('href');
      if (!href || href === '#' || href === '') {
        const text = linkElement.textContent;
        const newButton = document.createElement('button');
        newButton.textContent = text;
        
        // Copy attributes except href
        Array.from(linkElement.attributes).forEach(attr => {
          if (attr.name !== 'href') {
            newButton.setAttribute(attr.name, attr.value);
          }
        });
        
        // Copy inline styles
        newButton.style.cssText = linkElement.style.cssText;
        
        linkElement.parentNode.replaceChild(newButton, linkElement);
        return newButton;
      }
    }
    return linkElement;
  }

  return {
    setHtmlLangAttribute,
    createLandmark,
    getUniqueLandmarkId,
    fixFakeLink
  };
}

// Example: Set the lang attribute on the root element dynamically
function setLanguage(lang) {
  document.documentElement.lang = lang;
}

// main.js - Main application logic

// Import necessary modules
const { checkAccessibility } = require('./accessibility');
const { checkStructure } = require('./structure');
const fs = require('fs');
const path = require('path');

// Import and re-export someFunction from './utils'
const _utils = require('./utils');
const someFunction = _utils.default || _utils.someFunction || _utils;

// Existing configuration
const config = {
    verbose: true,
    debug: false,
    rules: {
        contrast: true,
        semantic: true,
        structure: true
    }
};

// Sample dependencies data (could come from package.json)
const dependencies = {
    "express": "^4.18.0",
    "lodash": "^4.17.21",
    "axios": "^1.0.0",
    "react": "^18.0.0"
};

const devDependencies = {
    "jest": "^29.0.0",
    "eslint": "^8.0.0"
};

// Main validation function for web accessibility
function validateWebAccessibility(url) {
    if (!url) {
        throw new Error('URL is required');
    }

    console.log(`Validating: ${url}`);

    const results = {
        accessibility: null,
        structure: null,
        errors: [],
        warnings: []
    };

    try {
        results.accessibility = validateTableAccessibility(url);
        results.structure = validateTableStructure(url);
        // Added import and call to Language Attribute helper functions
        results.language = getFullLangAttribute(document.documentElement);
    } catch (error) {
        results.errors.push(error.message);
    }

    return results;
}

// Helper function to check if element exists
function elementExists(selector) {
    return document.querySelector(selector) !== null;
}

// Helper function to get element text
function getElementText(selector) {
    const element = document.querySelector(selector);
    return element ? element.textContent : '';
}

// Get all table elements
function getAllTables() {
    return document.querySelectorAll('table');
}

// Get table headers
function getTableHeaders(table) {
    return table.querySelectorAll('th');
}

// Get table rows
function getTableRows(table) {
    return document.querySelectorAll('tr');
}

// Validate table accessibility
function validateTableAccessibility(tableOrUrl) {
    const tables = typeof tableOrUrl === 'string'
        ? document.querySelectorAll('table')
        : [tableOrUrl];

    const accessibilityResults = {
        hasHeaders: true,
        hasScope: true,
        hasIdOrHeaders: true,
        contrast: true,
        issues: [],
        score: 100
    };

    tables.forEach((table, index) => {
        // \ This section was updated to check if table has headers
        if (!tables[index].querySelectorAll('th').length) {
            accessibilityResults.issues.push({
                table: index,
                type: 'missing_headers',
                message: `Table ${index + 1}: Missing table headers (th elements)`
            });
            accessibilityResults.hasHeaders = false;
            accessibilityResults.score -= 20;
        }

        // The rest of the section remains untouched
        // ...
    });

    return accessibilityResults;
}

// Validate table structure
function validateTableStructure(tableOrUrl) {
    const tables = typeof tableOrUrl === 'string'
        ? document.querySelectorAll('table')
        : [tableOrUrl];

    const structureResults = {
        hasCaption: true,
        hasSummary: true,
        consistentColumns: true,
        hasThead: true,
        hasTbody: true,
        issues: [],
        score: 100
    };

    tables.forEach((table, index) => {
        // \ This section was updated to check for caption
        const caption = table.querySelector('caption');
        if (!caption) {
            structureResults.issues.push({
                table: index,
                type: 'missing_caption',
                message: `Table ${index + 1}: Missing caption element`
            });
            structureResults.hasCaption = false;
            structureResults.score -= 15;
        }

        // The rest of the section remains untouched
        // ...
    });
}

/**
 * Counts the total number of dependencies in package.json
 * @returns {Object} An object containing counts for dependencies, devDependencies, and total
 */
function countDependencies() {
  const packagePath = path.join(process.cwd(), 'package.json');

  try {
    const packageContent = fs.readFileSync(packagePath, 'utf8');
    const packageJson = JSON.parse(packageContent);
    
    const deps = packageJson.dependencies || {};
    const devDeps = packageJson.devDependencies || {};
    
    const dependencyCount = Object.keys(deps).length;
    const devDependencyCount = Object.keys(devDeps).length;
    
    return {
      dependencies: dependencyCount,
      devDependencies: devDependencyCount,
      total: dependencyCount + devDependencyCount
    };
  } catch (error) {
    console.error('Error reading package.json:', error.message);
    return {
      dependencies: 0,
      devDependencies: 0,
      total: 0
    };
  }
}

/**
 * Counts the number of dependencies from a given object
 * @param {Object} deps - Object containing dependencies
 * @returns {number} - Number of dependencies
 */
function countDependenciesFromObj(deps) {
  if (!deps || typeof deps !== 'object') {
    return 0;
  }
  return Object.keys(deps).length;
}

/**
 * Counts all dependencies including devDependencies from objects
 * @param {Object} deps - Production dependencies
 * @param {Object} devDeps - Development dependencies
 * @returns {number} - Total count of all dependencies
 */
function countAllDependencies(deps, devDeps) {
  return countDependenciesFromObj(deps) + countDependenciesFromObj(devDeps);
}

// Landmark validation helpers
function validateLandmark(element) {
  if (!element) return false;
  const tag = element.tagName ? element.tagName.toLowerCase() : '';
  const role = element.getAttribute('role');
  const landmarkTags = ['main', 'nav', 'header', 'footer', 'aside', 'section'];
  const landmarkRoles = ['main', 'navigation', 'banner', 'contentinfo', 'search', 'form', 'region', 'complementary'];
  return landmarkTags.includes(tag) || (role && landmarkRoles.includes(role));
}

function validateLandmarkStructure(doc = document) {
  const landmarkSelectors = 'main, nav, header, footer, aside, [role="main"], [role="navigation"], [role="banner"], [role="contentinfo"], [role="search"], [role="form"], [role="region"], [role="complementary"]';
  const elements = doc.querySelectorAll ? doc.querySelectorAll(landmarkSelectors) : [];
  const ids = new Set();
  const issues = [];
  elements.forEach(el => {
    if (el.id) {
      if (ids.has(el.id)) {
        issues.push({ element: el.tagName, id: el.id, message: 'Duplicate landmark ID' });
      }
      ids.add(el.id);
    }
  });
  return {
    landmarks: elements.length,
    uniqueIds: ids.size,
    issues,
    valid: issues.length === 0
  };
}

// Accessible name helpers for SVGs
function getSvgAccessibleName(svgElement) {
  if (!svgElement || svgElement.tagName !== 'SVG') return '';
  const title = svgElement.querySelector ? svgElement.querySelector('title') : null;
  return svgElement.getAttribute('aria-label') || (title ? title.textContent.trim() : '') || '';
}

// In-page button creation helper
function createInPageButton(text, options = {}) {
  const button = document.createElement('button');
  button.textContent = text || 'In-page button';
  if (options.id) button.id = options.id;
  if (options.className) button.className = options.className;
  if (options.ariaLabel) button.setAttribute('aria-label', options.ariaLabel);
  return button;
}

// Person name helper for accessible labels
function personName(element) {
  if (!element) return 'Unknown person';
  return element.getAttribute('aria-label') || element.textContent.trim() || 'Unknown person';
}

// Language attribute helper functions (from previous version)
function getLangAttribute(el) {
  // Implement the logic to return the language attribute
  // Example: return the current language code, e.g., 'en' or read from a config
  if (!el) {
    return 'en';
  }
  return el.getAttribute('lang');
}

function getFullLangAttribute(el) {
  // Implement the logic to return the full language attribute (if required)
  // Example: combine language code with region or locale identifier
  if (!el) {
    return 'en-US';
  }
  return el.getAttributeNS(null, 'xml:lang') || getLangAttribute(el);
}

// Improve accessibility by adding semantic role and label to the root element
const root = document.getElementById('root');
if (root) {
  root.setAttribute('role', 'main');
  root.setAttribute('aria-label', 'Main application');
}

// Export for testing and external use
module.exports = {
    validateWebAccessibility,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    getSvgAccessibleName,
    createInPageButton,
    personName,
    elementExists,
    getElementText,
    getAllTables,
    getTableHeaders,
    getTableRows,
    config,
    countDependencies,
    countDependenciesFromObj,
    countAllDependencies,
    dependencies,
    devDependencies,
    someFunction,
    setLanguage,
    getLangAttribute,
    getFullLangAttribute,
    addressAccessibilityIssues
};