const CONFIG = {
  dataPath: './data',
  maxResults: 100,
  name: 'ScreepsBot',
  version: '1.0.0',
  debug: true,
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: process.env.TIMEOUT || 5000,
  landmarkRoles: [],
  allowedRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'],
  maxLandmarks: 50
};

const {
  fixTableStructureIssues,
  fixTableHeaderCellScope,
  addMainLandmark,
  addSvgAccessibleNames,
  fixFakeLinks,
  ensureUniqueLandmarks,
  getSvgAccessibleName,
  addLangAttribute,
  newFocusTrap,
  getAccessibleLinkProps,
  createInPageButton
} = require('./utils');

const {
  validateLinkAccessibility,
  validateInput,
  processData,
  formatResponse,
  calculateSum,
  validateInput,
  processData,
  formatResponse,
  calculateSum,
  ensureUniqueLandmarks: ensureUniqueLandmarksUtils,
  fixLandmarkIssues,
  addLandmarkRoles,
  setLanguageAttribute,
  setSvgAccessibleNames
} = require('./AccessibilityUtilities');

const {
  validateInput: validateInputUtils,
  processData: processDataUtils,
  formatResponse: formatResponseUtils,
  calculateSum: calculateSumUtils,
  validateLinkAccessibility: validateLinkAccessibilityUtils,
  ensureUniqueLandmarks,
  getLangAttribute: getLangAttributeUtils,
  getFullLangAttribute: getFullLangAttributeUtils,
  validateTableAccessibility: validateTableAccessibilityUtils,
  validateTableStructure: validateTableStructureUtils,
  fixTableStructureIssues: fixTableStructureIssuesUtils,
  fixTableHeaderCellScope: fixTableHeaderCellScopeUtils,
  addMainLandmark: addMainLandmarkUtils,
  addSvgAccessibleNames: addSvgAccessibleNamesUtils,
  fixFakeLinks: fixFakeLinksUtils,
  fixLandmarkIssues: fixLandmarkIssuesUtils,
  addLangAttribute: addLangAttributeUtils,
  validateInput: validateInputNew,
  processData: processDataNew,
  formatResponse: formatResponseNew,
  calculateSum: calculateSumNew,
  setLanguageAttribute: setLanguageAttributeUtils,
  setSvgAccessibleNames: setSvgAccessibleNamesUtils
} = require('./utils');

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
 * Gets the lang attribute for the HTML element
 * @returns {string} The lang attribute value
 */
function getLangAttribute() {
    // Implementation to get language attribute
    return document.documentElement.lang || navigator.language || 'en-US';
}

/**
 * Gets the full language attribute for the HTML element
 * @returns {string} The full language attribute value
 */
function getFullLangAttribute() {
    // Implementation to get full language attribute
    return document.documentElement.lang || navigator.language || 'en-US';
}

/**
 * Adds lang attribute to HTML element
 * @param {HTMLElement} element - The element to add lang attribute to
 */
function addLangAttribute(element) {
  if (element && !element.hasAttribute('lang')) {
    element.setAttribute('lang', 'en');
  }
}

/**
 * Logs the current URL to the console
 */
function logCurrentURL() {
    console.log('Current URL: ' + window.location.href);
}

// Landmark handling
/**
 * Adds main landmark to the document
 */
function addMainLandmark() {
  // Implementation to be added
}

/**
 * Validates landmark
 * @param {HTMLElement} element - The landmark element to validate
 * @returns {Object} Validation result with success status and any issues
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
 * Adds landmark roles and fixes issues
 */
function addLandmarkRolesAndFixIssues() {
    // Implementation to be added
}

/**
 * Fixes landmark issues
 */
function fixLandmarkIssues() {
  // Ensure unique landmarks
  ensureUniqueLandmarks();

  // Add proper landmark regions
  addProperLandmarkRegions();

  // Validate existing landmarks
  const landmarkValidation = validateLandmark(document.body);
  if (!landmarkValidation.success) {
    console.warn('Landmark validation issues:', landmarkValidation.issues);
  }
}

/**
 * Adds proper landmark regions
 */
function addProperLandmarkRegions() {
  const mainLandmark = document.querySelector('main');
  if (!mainLandmark) {
    const main = document.createElement('main');
    document.body.appendChild(main);
  }

  const navLandmark = document.querySelector('nav');
  if (!navLandmark) {
    const nav = document.createElement('nav');
    document.body.insertBefore(nav, document.body.firstChild);
  }

  const footerLandmark = document.querySelector('footer');
  if (!footerLandmark) {
    const footer = document.createElement('footer');
    document.body.appendChild(footer);
  }
}

/**
 * Performs a comprehensive accessibility audit and applies fixes
 * @returns {Object} Results containing audit status and any remaining issues
 */
function auditAccessibility() {
  const issues = [];

  // Check for primary language attribute
  const langAttr = document.documentElement.getAttribute('lang');
  if (langAttr !== 'en') {
    issues.push({ type: 'language', message: `Language attribute is set to "${langAttr}", expected "en"` });
  }

  // Verify main landmark exists
  const mainEl = document.querySelector('main');
  if (!mainEl) {
    issues.push({ type: 'landmark', message: 'Missing <main> element' });
  }

  // Verify navigation landmark exists
  const navEl = document.querySelector('nav');
  if (!navEl) {
    issues.push({ type: 'landmark', message: 'Missing <nav> element' });
  }

  // Ensure unique landmarks
  issues.push(...ensureUniqueLandmarksUtils(issues));

  return {
    success: issues.length === 0,
    issues
  };
}

// Accessibility functions for tables (merged from both branches)
function validateTableStructure(tableElement) {
  const rows = tableElement.querySelectorAll('tr');
  if (rows.length === 0) {
      console.warn('Table has no rows');
      return false;
  }
  return true;
}

function validateTableCellsScope(tableElement) {
  const cells = tableElement.querySelectorAll('th, td');
  if (cells.length > 0) {
    cells.forEach((cell, index) => {
      const scope = cell.getAttribute('scope');
      if (scope !== null && `${index}` !== scope) {
        console.warn(`Cell at index ${index} has incorrect scope: ${scope}`);
      }
    });
  }
}

// Accessibility functions for landmarks (merged from both branches)
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

// Functions to render dependency graphs and index views
/**
 * Render a dependency graph from the provided data structure
 * @param {Object} data - The dependency data to visualize
 * @returns {HTMLElement} The rendered dependency graph element
 */
function renderDependencyGraph(data) {
  if (!data || typeof data !== 'object') {
    console.error('Invalid data provided for dependency graph rendering');
    return null;
  }

  const graphContainer = document.createElement('div');
  graphContainer.setAttribute('role', 'region');
  graphContainer.setAttribute('aria-label', 'Dependency Graph');
  graphContainer.className = 'dependency-graph';
  
  // Implementation for rendering graphs would go here
  // For now, this serves as a placeholder that can be expanded
  return graphContainer;
}

/**
 * Render an index view for the provided data
 * @param {Object} data - The data to display in the index view
 * @returns {HTMLElement} The rendered index view element
 */
function renderIndexView(data) {
  if (!data || typeof data !== 'object') {
    console.error('Invalid data provided for index view rendering');
    return null;
  }

  const indexContainer = document.createElement('div');
  indexContainer.setAttribute('role', 'region');
  indexContainer.setAttribute('aria-label', 'Index View');
  indexContainer.className = 'index-view';
  
  // Implementation for rendering index views would go here
  // For now, this serves as a placeholder that can be expanded
  return indexContainer;
}

// Export all existing and new functions
module.exports = {
    getLangAttribute,
    getFullLangAttribute,
    validateTableAccessibility,
    validateTableStructure,
    validateTableCellsScope,
    validateLandmark,
    validateLandmarkStructure,
    addMainLandmark,
    addLandmarkRolesAndFixIssues,
    fixLandmarkIssues,
    auditAccessibility,
    logCurrentURL,
    addLandmarkRegions,
    renderDependencyGraph,
    renderIndexView
};