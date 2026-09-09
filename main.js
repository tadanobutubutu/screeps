// Address accessibility issues from insight report
// Import the required functions from both branches
const someFunction = { someFunction: () => 'someFunction result' };
const { validateTableAccessibility, validateTableStructure } = require('./tableAccessibility');
const { getLangAttribute, wrapPrimaryContentInMain } = require('./langAttribute');
const { validateLandmark, validateLandmarkStructure, addFixLandmarkIssues } = require('./landmark');
const { getSvgAccessibleName, addAriaToFormControls } = require('./svgAccessibleName');

// Rename existing ensureUniqueLandmarks function
function uniqueLandmarks() {
  // Example implementation from origin/main - adapted for Screeps environment
  const landmarks = ['main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region'];
  landmarks.forEach(landmark => {
    const matchingGameObjects = Game.getObjectsByIdTag(landmark);
    const uniqueGameObjects = [];
    matchingGameObjects.forEach(go => {
      const isUnique = !uniqueGameObjects.some(ugo => ugo === go);
      if (isUnique) {
        uniqueGameObjects.push(go);
      } else {
        // Remove the landmark tag if it's not unique
        go.remove(landmark);
      }
    });
  });
}

// Function to ensure unique landmarks - new implementation
function ensureUniqueLandmarks() {
  // Previous implementation moved to uniqueLandmarks() function
}

// New function to address accessibility issues from insight report
function addressAccessibilityIssues() {
  // Ensure the dependencyGraph container has a proper ARIA role
  // Support both class and data attribute selectors for compatibility
  const dependencyGraph = document.querySelector('.dependency-graph') || document.querySelector('[data-dependency-graph]');
  if (dependencyGraph) {
    dependencyGraph.setAttribute('role', 'tree');
    dependencyGraph.setAttribute('aria-label', 'Dependency Graph');
  }

  // Ensure all clickable elements are focusable
  const focusable = document.querySelectorAll('.dependencyGraph a, .dependencyGraph button');
  focusable.forEach(el => {
    if (el.tabIndex < 0) el.tabIndex = 0;
  });

  // New function to ensure unique landmarks
  uniqueLandmarks();

  // New function to add proper landmarkRegions
  addProperLandmarkRegions();

  // New functions to validate table accessibility and structure
  validateTableAccessibility();
  validateTableStructure();

  // New functions to validate landmark, landmark structure and add fix landmark issues
  validateLandmark();
  validateLandmarkStructure();
  addFixLandmarkIssues();

  // New functions to get SVG accessible name and add ARIA to form controls
  getSvgAccessibleName();
  addAriaToFormControls();
}

// Import the required functions from both branches
const { someFunction } = { someFunction: () => 'someFunction result' };
const { ensureUniqueLandmarks } = addressAccessibilityIssues; // Extract the function from the addressAccessibilityIssues function
const { addProperLandmarkRegions } = require('./properLandmarkRegions');

function renderDependencyGraphContent(data) {
  // Replace the existing content within the dependencyGraph div using the provided data.
  // Support both class and data attribute selectors for compatibility
  const container = document.querySelector('.dependency-graph-content') || document.querySelector('[data-dependency-graph-content]');
  if (container) {
    container.innerHTML = data;
  }
}

// Function to ensure unique landmarks
//function ensureUniqueLandmarks() { // Remove this unused function definition
// ...
//}

  // Ensure all clickable elements are focusable
  const focusable = document.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
  focusable.forEach(el => {
    if (el.tabIndex < 0) el.tabIndex = 0;
  });
}

function addressInsightReportIssues(insightReport) {
  const issues = insightReport.issues || [];
  issues.forEach(issue => {
    const element = document.querySelector(issue.selector);
    if (element) {
      // Add lang attribute to HTML element
      if (issue.code === 'REACT_015') {
        document.documentElement.lang = 'en';
      }
      // Add landmark roles and fix landmark issues
      if (issue.code === 'REACT_017') {
        if (issue.ariaRole) {
          element.setAttribute('role', issue.ariaRole);
        }
      }
      // Add accessible names to 2 SVGs
      if (issue.code === 'REACT_041') {
        if (issue.ariaLabel) {
          element.setAttribute('aria-label', issue.ariaLabel);
        }
      }
      // Ensure unique landmarks (2 issues)
      if (issue.code === 'REACT_025') {
        ensureUniqueLandmarks();
      }
      // Fix 1 fake link issue
      if (issue.code === 'REACT_036') {
        fixFakeLinks();
      }
      // Add scope="col" or scope="row" to <th> elements (already implemented)
      if (issue.code === 'REACT_027') {
        // This issue is already implemented, so no action is needed here
      }
    }
  });
}

// Generalized accessibility functions
function improveAccessibility() {
  // ... (unchanged)
}

function addressInsightReportIssues(insightReport) {
  // ... (unchanged)
}

// New function to address accessibility issues from insight report
function ensureUniqueLandmarks() {
  const landmarks = ['main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region'];
  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(`[role="${landmark}"]`);
    const uniqueElements = [];
    elements.forEach(el => {
      const isUnique = !uniqueElements.some(uEl => uEl === el);
      if (isUnique) {
        uniqueElements.push(el);
      } else {
        // Remove the role if it's not unique
        el.removeAttribute('role');
      }
    });
  });
}

// New function to add landmark roles and fix issues
function handleInsightReportIssues(insightReport) {
  const issues = insightReport.issues || [];
  issues.forEach(issue => {
    if (issue.code === 'REACT_017') {
      const element = document.querySelector(issue.selector);
      if (element && issue.ariaRole) {
        element.setAttribute('role', issue.ariaRole);
      }
    }
  });
}

// Placeholder implementation for rendering a dependency graph
function renderDependencyGraph(dependencyData) {
  console.log('Rendering dependency graph with data:', dependencyData);
}

// Placeholder function for index view rendering (to be replaced with actual implementation)
function renderIndexView(indexData) {
  console.log('Rendering index view with data:', indexData);
}

// Function to calculate sum (unchanged)
function calculateSum(a, b) {
  return a + b;
}

// Example logic to ensure unique landmarks (from origin/main)
// Note: This function uses DOM APIs and may need adaptation for Screeps environment
function getAllLandmarks() {
  // This is a browser-oriented example that would need to be adapted for Node.js/Screeps
  // Keeping it as provided in origin/main for reference
  const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], [role="search"], [role="contentinfo"], [role="complementary"], [role="form"], [role="region"]');
  return Array.from(landmarks);
}

// Fixed function to handle unique landmarks with proper cleanup
function ensureUniqueLandmarks() {
  const landmarks = ['main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region'];
  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(`[role="${landmark}"]`);
    const uniqueElements = [];
    elements.forEach(el => {
      const isUnique = !uniqueElements.some(uEl => uEl === el);
      if (isUnique) {
        uniqueElements.push(el);
      } else {
        // Remove the role if it's not unique
        el.removeAttribute('role');
      }
    });
  });
}

// Fix fake link issue
function fixFakeLinks() {
  // Implementation for fixing fake link issues goes here.
  // Handle both anchor tags with href="#" and div elements with role="link"
  const fakeLinkAnchors = document.querySelectorAll('a[href="#"]');
  const fakeLinkDivs = document.querySelectorAll('[role="link"]');
  
  [...fakeLinkAnchors, ...fakeLinkDivs].forEach(link => {
    link.setAttribute('role', 'button');
    link.setAttribute('tabindex', '0');
    if (!link.textContent && !link.getAttribute('aria-label')) {
      link.setAttribute('aria-label', 'Button');
    }
  });
}

// Add lang attribute to HTML element
function addLangAttribute() {
  const htmlElement = document.documentElement;
  return htmlElement.getAttribute('lang') || 'en';
}

/**
 * Gets the language attribute from the HTML element or returns default
 * @returns {string} The language code
 */
export function getLangAttribute() {
  const htmlElement = document.documentElement;
  return htmlElement.getAttribute('lang') || 'en';
}

/**
 * Creates an accessible in-page button that scrolls to a target element
 * @param {string} href - CSS selector or ID for the target element
 * @param {string} label - Accessible label for the button
 * @returns {HTMLButtonElement} The button element with proper accessibility attributes
 */
export function createInPageButton(href, label) {
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.setAttribute('aria-label', label);
  
  button.addEventListener('click', () => {
    const targetId = href.replace('#', '');
    const target = document.getElementById(targetId) || document.querySelector(targetId);
    if (target) {
      target.setAttribute('tabindex', '-1');
      target.focus();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
  
  return button;
}

/**
 * Validates that a table has proper accessibility features
 * @param {HTMLTableElement} table - The table element to validate
 * @returns {boolean} True if table is accessible
 */
export function validateTableAccessibility(table) {
  if (!table || table.tagName !== 'TABLE') {
    return false;
  }
  
  // Check for caption
  const hasCaption = table.querySelector('caption') !== null;
  
  // Check for table headers (th elements)
  const headers = table.querySelectorAll('th');
  const hasHeaders = headers.length > 0;
  
  // Validate that headers have proper scope attributes
  const headersHaveScope = Array.from(headers).every(th => {
    const scope = th.getAttribute('scope');
    return scope === 'col' || scope === 'row';
  });
  
  // Check for proper thead/tbody structure
  const hasThead = table.querySelector('thead') !== null;
  const hasTbody = table.querySelector('tbody') !== null;
  
  return hasCaption && hasHeaders && headersHaveScope && hasThead && hasTbody;
}

/**
 * Validates and fixes table structure for accessibility
 * @param {HTMLTableElement} table - The table element to validate/fix
 * @returns {Object} Validation result with issues found
 */
export function validateTableStructure(table) {
  const issues = [];
  
  if (!table || table.tagName !== 'TABLE') {
    return { valid: false, issues: ['Invalid table element'] };
  }
  
  // Check for missing thead
  if (!table.querySelector('thead')) {
    issues.push('Missing thead element');
  }
  
  // Check for missing tbody
  if (!table.querySelector('tbody')) {
    issues.push('Missing tbody element');
  }
  
  // Check for missing caption
  if (!table.querySelector('caption')) {
    issues.push('Missing caption element');
  }
  
  // Check for headers without scope attribute
  const headers = table.querySelectorAll('th');
  headers.forEach((th, index) => {
    if (!th.getAttribute('scope')) {
      issues.push(`Header at index ${index} missing scope attribute`);
    }
  });
  
  // Check for proper row/column structure
  const rows = table.querySelectorAll('tr');
  let columnCount = 0;
  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('th, td');
    if (columnCount === 0) {
      column