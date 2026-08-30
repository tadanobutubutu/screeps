// Existing code starts here

// This is the existing code that needs to be preserved
// (This comment remains as-is)

// More existing code that should be preserved

// Existing code ends here

// TODO: This is the existing code that needs to be preserved
// (This should be preserved)
// Addressed accessibility issues from insight report

// ... (other code in main.js)

/**
 * Creates an in-page button element with optional click handler.
 * @param {string} buttonText - The label text for the button
 * @param {Function} onClickHandler - Callback function triggered when the button is clicked
 * @returns {HTMLElement} The created button element
 */
function createInPageButton(buttonText, onClickHandler) {
  const button = document.createElement('button');
  button.textContent = buttonText;
  if (onClickHandler && typeof onClickHandler === 'function') {
    button.addEventListener('click', onClickHandler);
  }
  return button;
}

// If the `rotateBack` function is defined elsewhere in main.js, ensure it's called when the button is clicked.
// If not, define it here:
export function rotateBack() {
  // Your code to rotate back
  console.log('Reverting back the rotation.');
}

// ... (other code in main.js)

// Additional accessibility-related code changes:
// Ensure that all interactive elements have appropriate keyboard support
// Check that ARIA attributes are correctly paired and have appropriate values

// REACT_015: lang attribute should be added to the HTML element (typically in index.html)
// <html lang="en">

// REACT_017: Add landmark roles and fix landmark issues
// Add main landmark role to main content area
// Example: <main role="main">...</main>

// REACT_025: Ensure unique landmarks
// Ensure only one main landmark per page
// Use unique aria-label or aria-labelledby for landmark regions

// REACT_036: Fix fake link issue - convert <a href="#"> to <button> with proper ARIA
function createUnrotateButton() {
  const button = document.createElement('button');
  button.id = 'unrotate';
  button.setAttribute('role', 'button');
  button.setAttribute('aria-label', 'rotate back');
  button.textContent = 'rotate back';
  button.addEventListener('click', rotateBack);
  return button;
}

// Replace fake links with proper buttons
const fakeLink = document.querySelector('a[href="#"]');
if (fakeLink && fakeLink.tagName === 'A') {
  const parent = fakeLink.parentElement;
  const newButton = createUnrotateButton();
  parent.replaceChild(newButton, fakeLink);
}

// Add lang attribute to HTML element
if (typeof document !== 'undefined') {
  document.documentElement.lang = 'en-US';
}

/**
 * Get the application configuration
 * @returns {Object} The configuration object with apiUrl and timeout properties
 */
function getConfig() {
  return {
    apiUrl: process.env.API_URL || '',
    timeout: 5000
  };
}

// Example usage for SVGs:
// const svg1 = document.querySelector('#svg1');
// const svg2 = document.querySelector('#svg2');
// setSvgAttributes(svg1, 'Description of first icon');
// setSvgAttributes(svg2, 'Description of second icon');

// REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// Ensure all <th> elements have scope attribute
function ensureThScope() {
  const thElements = document.querySelectorAll('th');
  thElements.forEach(th => {
    if (!th.hasAttribute('scope')) {
      // Determine if it's a column header or row header based on context
      const parent = th.parentElement;
      const parentTagName = parent ? parent.tagName.toLowerCase() : '';
      const isFirstCell = parent && parent.cellIndex === 0;

      if (isFirstCell && parentTagName === 'tr') {
        th.setAttribute('scope', 'row');
      } else if (parentTagName === 'thead' || !isFirstCell) {
        th.setAttribute('scope', 'col');
      }
    }
  });
}

/**
 * Setup skip link functionality for keyboard navigation
 */
function setupSkipLinks() {
  const skipLink = document.querySelector('.skip-link') || document.getElementById('skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(skipLink.getAttribute('href') || '');
      if (target) {
        target.focus();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

/**
 * Ensure buttons have proper accessibility attributes
 */
function setupButtonAccessibility() {
  const buttons = document.querySelectorAll('button');
  buttons.forEach((button) => {
    if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
      button.setAttribute('aria-label', 'Action button');
    }
  });
}

/**
 * Perform a task with the given parameters
 * @param {string} task - The task to perform
 */
function performTask(task) {
  console.log(`Performing task: ${task}`);
  // Task implementation details would go here
}

/**
 * Handle an event with the given parameters
 * @param {string} event - The event to handle
 */
function handleEvent(event) {
  console.log(`Handling event: ${event}`);
  // Event handling logic would go here
}

function addLandmarkRoles() {
  const header = document.querySelector('header');
  if (header) header.setAttribute('role', 'banner');

  const mainContent = document.querySelector('main');
  if (mainContent) mainContent.setAttribute('role', 'main');

  const footer = document.querySelector('footer');
  if (footer) footer.setAttribute('role', 'contentinfo');
}

// Function to add accessible names to 2 SVGs
function addSvgAccessibleNames() {
  const svg1 = document.querySelector('#svg1');
  if (svg1) svg1.setAttribute('aria-label', 'SVG image 1');

  const svg2 = document.querySelector('#svg2');
  if (svg2) svg2.setAttribute('aria-label', 'SVG image 2');
}

// Function to ensure unique landmarks (2 issues)
function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('[role="banner"], [role="main"], [role="contentinfo"]');
  const landmarkIds = new Set();

  landmarks.forEach((landmark) => {
    const id = landmark.id;
    if (landmarkIds.has(id)) {
      console.error('Duplicate landmar ID encountered:', id);
    } else {
      landmarkIds.add(id);
    }
  });
}

// Function to fix 1 fake link issue
function fixFakeLink() {
  const fakeLinks = document.querySelectorAll('a[href="#"][aria-hidden="true"]');
  fakeLinks.forEach((link) => {
    handleFakeLinks(link);
  });
}

// Initialize accessibility improvements
function initializeAccessibility() {
  // Replace fake links with proper buttons
  const fakeLink = document.querySelector('a[href="#"]');
  if (fakeLink && fakeLink.tagName === 'A') {
    const parent = fakeLink.parentElement;
    const newButton = createUnrotateButton();
    parent.replaceChild(newButton, fakeLink);
  }

  // Ensure table headers have proper scope
  ensureThScope();

  // Add accessible names to SVGs
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!svg.getAttribute('aria-label') || svg.getAttribute('aria-hidden') !== 'true') {
      svg.setAttribute('aria-label', `Icon ${index + 1}`);
    }
  });
}

// Initialize the application with accessibility improvements
function initialize() {
  // Existing initialization logic preserved
  console.log('Application initialized');

  // Accessibility: Ensure main content is keyboard accessible
  const mainContent = document.querySelector('main') || document.getElementById('main');
  if (mainContent) {
    mainContent.setAttribute('tabindex', '-1');
    mainContent.setAttribute('role', 'main');
  }

  // Accessibility: Add skip link functionality
  setupSkipLinks();

  // Accessibility: Ensure buttons have proper labels
  setupButtonAccessibility();

  // Accessibility: Add landmark roles and fix landmark issues
  addLandmarkRoles();

  // Accessibility: Add accessible names to 2 SVGs
  addSvgAccessibleNames();

  // Accessibility: Ensure unique landmarks (2 issues)
  ensureUniqueLandmarks();

  // Accessibility: Fix 1 fake link issue
  fixFakeLink();
}

// New function or change requested in the issue
function newFunction() {
  // Implementation of the new function
}

export function calculateDiscount(price, discount) {
  if (typeof price !== 'number' || price < 0) {
    throw new Error('Price must be a non-negative number');
  }
  if (typeof discount !== 'number' || discount < 0) {
    throw new Error('Discount must be a non-negative number');
  }

  // Calculate discounted price
  const discountedPrice = price * (1 - discount / 100);
  return Math.max(0, discountedPrice);
}

function greet(name) {
  return `Hello, ${name}!`;
}

function add(a, b) {
  return a + b;
}

/**
 * Generate a report from the given data and configuration
 * @param {Object} data - The data to include in the report
 * @param {Object} options - Configuration options for report generation
 * @param {string} options.format - Output format (e.g., 'json', 'csv', 'html')
 * @param {string} options.title - Title for the report
 * @returns {string} The generated report content
 */
function generateReport(data, options = {}) {
  const config = getConfig();
  const format = options.format || 'json';
  const title = options.title || 'Generated Report';
  
  const report = {
    title: title,
    generatedAt: new Date().toISOString(),
    data: data,
    metadata: {
      apiUrl: config.apiUrl,
      timeout: config.timeout
    }
  };
  
  switch (format.toLowerCase()) {
    case 'json':
      return JSON.stringify(report, null, 2);
    case 'csv': {
      const headers = Object.keys(data[0] || {}).join(',');
      const rows = (data || []).map(row => Object.values(row).join(',')).join('\n');
      return `${headers}\n${rows}`;
    }
    case 'html':
      return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
</head>
<body>
  <h1>${title}</h1>
  <p>Generated at: ${report.generatedAt}</p>
  <pre>${JSON.stringify(data, null, 2)}</pre>
</body>
</html>`;
    default:
      return JSON.stringify(report, null, 2);
  }
}

// Export existing functionality and new functions
export { 
  initialize, 
  getConfig, 
  setupSkipLinks, 
  setupButtonAccessibility, 
  createInPageButton, 
  performTask, 
  handleEvent, 
  greet, 
  add, 
  calculateDiscount, 
  newFunction,
  generateReport
};

// Initialize on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
}

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

document.documentElement.lang = 'en';

reportWebVitals();

const VERSION = '1.0.0';

const CONFIG = {
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  env: process.env.NODE_ENV || 'development'
};

function initialize() {
  console.log('Application initialized');
  return true;
}

function getConfig() {
  return CONFIG;
}

function getVersion() {
  return VERSION;
}

// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
function addressAccessibilityIssues() {
  // Ensure the root container has an accessible name
  const rootContainer = document.getElementById('root');
  if (rootContainer) {
    rootContainer.setAttribute('role', 'main');
  }

  // Create a hidden live region for dynamic announcements
  const announcementId = 'accessibility-announcement';
  let announcement = document.getElementById(announcementId);
  if (!announcement) {
    announcement = document.createElement('div');
    announcement.id = announcementId;
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    // Hide off-screen
    announcement.style.position = 'absolute';
    announcement.style.left = '-9999px';
    announcement.style.top = '-9999px';
    document.body.appendChild(announcement);
  }
}

// Validate that tables in the document are accessible
function validateTableAccessibility() {
  const tables = document.querySelectorAll('table');
  const results = [];
  
  tables.forEach((table, index) => {
    const hasCaption = table.querySelector('caption') !== null;
    const hasHeaders = table.querySelector('th') !== null;
    const hasScope = Array.from(table.querySelectorAll('th')).every(
      th => th.hasAttribute('scope')
    );
    
    results.push({
      tableIndex: index,
      hasCaption,
      hasHeaders,
      hasScope,
      isAccessible: hasCaption && hasHeaders && hasScope
    });
  });
  
  return results;
}

// Validate the structure of tables in the document
function validateTableStructure() {
  const tables = document.querySelectorAll('table');
  const results = [];
  
  tables.forEach((table, index) => {
    const rows = table.querySelectorAll('tr');
    let isValid = true;
    let error = null;
    
    if (rows.length === 0) {
      isValid = false;
      error = 'Table has no rows';
    } else {
      const cellCounts = Array.from(rows).map(row => row.querySelectorAll('th, td').length);
      const allSame = cellCounts.every(count => count === cellCounts[0]);
      
      if (!allSame) {
        isValid = false;
        error = 'Table has inconsistent cell counts across rows';
      }
    }
    
    results.push({
      tableIndex: index,
      rowCount: rows.length,
      isValid,
      error
    });
  });
  
  return results;
}

// Generate accessibility report
function generateAccessibilityReport() {
  const timestamp = new Date().toISOString();
  const tableAccessibilityResults = validateTableAccessibility();
  const tableStructureResults = validateTableStructure();
  
  const totalTables = tableAccessibilityResults.length;
  const accessibleTables = tableAccessibilityResults.filter(r => r.isAccessible).length;
  const validStructures = tableStructureResults.filter(r => r.isValid).length;
  
  const issues = [];
  
  tableAccessibilityResults.forEach((result, index) => {
    if (!result.isAccessible) {
      const issue = { tableIndex: index, type: 'accessibility' };
      if (!result.hasCaption) issue.reason = 'Missing caption';
      else if (!result.hasHeaders) issue.reason = 'Missing header cells';
      else if (!result.hasScope) issue.reason = 'Headers missing scope attribute';
      issues.push(issue);
    }
  });
  
  tableStructureResults.forEach((result, index) => {
    if (!result.isValid && result.error) {
      issues.push({ tableIndex: index, type: 'structure', reason: result.error });
    }
  });
  
  return {
    timestamp,
    summary: {
      totalTables,
      accessibleTables,
      validStructures,
      accessibilityScore: totalTables > 0 ? Math.round((accessibleTables / totalTables) * 100) : 100,
      structureScore: totalTables > 0 ? Math.round((validStructures / totalTables) * 100) : 100
    },
    issues,
    tableAccessibility: tableAccessibilityResults,
    tableStructure: tableStructureResults
  };
}

// Export the new function
export {
  VERSION,
  CONFIG,
  initialize,
  getConfig,
  getVersion,
  addressAccessibilityIssues,
  root,
  validateTableAccessibility,
  validateTableStructure,
  generateAccessibilityReport
};

// Add the new function to the default export
export default {
  VERSION,
  CONFIG,
  initialize,
  getConfig,
  getVersion,
  addressAccessibilityIssues,
  root,
  validateTableAccessibility,
  validateTableStructure,
  generateAccessibilityReport
};