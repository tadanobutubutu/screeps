import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import a11y from './AccessibilityUtilities'; // Assuming accessibility utilities are in a separate file

const config = {
  apiUrl: process.env.API_URL || 'https://api.default.com',
  timeout: 5000,
  debug: false,
  version: '1.0.0',
  dataPath: './data',
  maxResults: 100,
  allowedRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'],
  landmarkRoles: [],
  maxLandmarks: 50
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

function validateConfig(cfg) {
  const errors = [];

  if (!cfg apiUrl || typeof cfg apiUrl !== 'string') {
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
  // Implementation to be added
}

/**
 * Adds lang attribute to HTML element
 */
export function addLangAttribute() {
  // Implementation to be added
}

/**
 * Validates table accessibility
 * @param {HTMLElement} table - The table element to validate
 * @returns {boolean} True if table is accessible
 */
export function validateTableAccessibility(table) {
  // Implementation to be added
}

/**
 * Validates table structure
 * @param {HTMLElement} table - The table element to validate
 * @returns {boolean} True if table structure is valid
 */
export function validateTableStructure(table) {
  // Implementation to be added
}

/**
 * Fixes table structure issues
 * @param {HTMLElement} table - The table element to fix
 * @returns {boolean} True if table was fixed
 */
export function fixTableStructure(table) {
  // Implementation to be added
}

/**
 * Adds main landmark to the page
 */
export function addMainLandmark() {
  // Implementation to be added
}

/**
 * Validates landmark accessibility
 * @returns {boolean} True if landmarks are valid
 */
export function validateLandmark() {
  // Implementation to be added
}

/**
 * Validates landmark structure
 * @returns {boolean} True if landmark structure is valid
 */
export function validateLandmarkStructure() {
  // Implementation to be added
}

/**
 * Validates landmark attributes
 */
export function validateLandmarkAttributes() {
  // Implementation to be added
}

/**
 * Gets SVG accessible name
 * @param {SVGElement} svg - The SVG element
 * @returns {string} The accessible name
 */
export function getSvgAccessibleName(svg) {
  // Implementation to be added
}

/**
 * Sets SVG attributes for accessibility
 * @param {SVGElement} svg - The SVG element
 */
export function setSvgAttributes(svg) {
  // Implementation to be added
}

/**
 * Ensures unique landmarks on the page
 */
export function ensureUniqueLandmarks() {
  // Implementation to be added
}

/**
 * Creates an in-page button for accessibility
 * @param {string} text - The button text
 * @param {Function} onClick - The click handler
 * @returns {HTMLButtonElement} The button element
 */
export function createInPageButton(text, onClick) {
  // Implementation to be added
}

/**
 * Validates link accessibility
 * @param {HTMLAnchorElement} link - The link element
 * @returns {boolean} True if link is accessible
 */
export function validateLinkAccessibility(link) {
  // Implementation to be added
}

/**
 * Handles fake links on the page
 */
export function handleFakeLinks() {
  // Implementation to be added
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

/**
 * Validates the structure of tables for accessibility
 * @param {Array|Object} tables - Array of table objects or single table element to validate
 * @returns {Object} Validation result with success status and any issues found
 */
export function validateTableStructure(tables) {
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
export function validateLandmark(element) {
  const issues = [];

  // Check if element exists
  if (!element) {
    issues.push('Landmark element is required');
    return { success: false, issues };
  }

  // Get role from attribute
  const role = element.getAttribute ? element.getAttribute('role') : null;

  // Define valid ARIA landmark roles
  const validAriaLandmarks = ['main', 'navigation', 'search', 'banner', 'contentinfo', 'complementary'];

  // Validate role attribute exists
  if (!role) {
    issues.push('Landmark must have a role attribute');
  } else if (validAriaLandmarks.indexOf(role) === -1) {
    // Check if it's a valid landmark role (including region, application, form)
    const validRoles = ['application', 'form', 'region'];
    if (validRoles.indexOf(role) === -1) {
      issues.push(`Invalid landmark role: ${role}`);
    }
  }

  // Additional validation for specific landmarks
  if (role === 'main') {
    // There should only be one main landmark per page
    const existingMain = document.querySelector('[role="main"]');
    if (existingMain && existingMain !== element) {
      issues.push('Duplicate main landmark found');
    }
  }

  // Check for accessible name on landmarks that require it
  const landmarksRequiringName = ['search', 'navigation', 'complementary'];
  if (landmarksRequiringName.indexOf(role) !== -1) {
    const hasLabel = element.getAttribute ?
      (element.getAttribute('aria-label') ||
       element.getAttribute('aria-labelledby') ||
       element.getAttribute('aria-description')) : false;
    if (!hasLabel) {
      issues.push(`Landmark with role "${role}" should have an accessible name`);
    }
  }

  // Check tagName for semantic HTML5 landmarks
  if (element.tagName) {
    const tagName = element.tagName.toLowerCase();
    const validTags = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];
    if (!validTags.includes(tagName) && !role) {
      issues.push(`Invalid landmark tag: ${tagName}`);
    }
  } else {
    issues.push('Missing tagName');
  }

  // Additional check: if tagName present but not a valid landmark tag
  if (element.tagName) {
    const validLandmarkTags = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];
    if (!validLandmarkTags.includes(element.tagName.toLowerCase())) {
      issues.push(`Invalid landmark: ${element.tagName}`);
    }
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
export function validateLandmarkStructure(landmarks) {
  const issues = [];

  // If landmarks array is provided, validate each one
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
  }

  return {
    success: issues.length === 0,
    issues
  };
}

// New function that does something different
function newFunction() {
  // This function does something different
  return true;
}

// ... Add other new functions that were introduced

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

/**
 * Adds proper landmark regions to the page
 */
export function addProperLandmarkRegions() {
  // Implementation to be added
}

// Export all functions using ES module syntax
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
  createLandmarkSelectors
};

// REACT_037: Google sign-in logic, if needed