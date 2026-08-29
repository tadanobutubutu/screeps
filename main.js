/**
 * Main application entry point
 *
 * Combines legacy table utilities with React-based accessibility enhancements.
 * - Legacy utilities (checkTableStructure, formatDate, sanitizeInput, createDataTable)
 *   remain available for non-React usage and for tests.
 * - Accessibility utilities are pulled in via the React app entry point.
 */

// Configuration
const config = {
  apiUrl: 'https://api.example.com',
  debug: false,
  timeout: 5000
};

/**
 * Checks the structure of a table element
 * @param {HTMLTableElement} table - The table element to validate
 * @returns {Object} - Validation result object
 */
function checkTableStructure(table) {
  const result = {
    isValid: true,
    errors: [],
    warnings: [],
    rowCount: 0,
    columnCount: 0,
    hasHeader: false,
    hasBody: false,
    hasFooter: false
  };

  // Check if table element exists
  if (!table) {
    result.isValid = false;
    result.errors.push('Table element is null or undefined');
    return result;
  }

  // Check for table sections
  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');
  const tfoot = table.querySelector('tfoot');

  result.hasHeader = !!thead;
  result.hasBody = !!tbody;
  result.hasFooter = !!tfoot;

  // Get all rows
  const allRows = table.querySelectorAll('tr');
  result.rowCount = allRows.length;

  if (result.rowCount === 0) {
    result.isValid = false;
    result.errors.push('Table has no rows');
    return result;
  }

  // Check header structure
  if (!result.hasHeader) {
    result.warnings.push('Table has no thead element');
  } else {
    const headerCells = thead.querySelectorAll('td, th');
    result.columnCount = headerCells.length;
  }

  // Validate row consistency
  const targetRow = tbody || allRows[0];
  const firstRowCells = targetRow.querySelectorAll('th, td');
  const expectedCellCount = firstRowCells.length || result.columnCount;

  allRows.forEach((row, index) => {
    const cells = row.querySelectorAll('th, td');
    if (cells.length !== expectedCellCount) {
      result.isValid = false;
      result.errors.push(`Row ${index} has ${cells.length} cells, expected ${expectedCellCount}`);
    }
  });

  return result;
}

/**
 * Format date for display
 * @param {Date|string} date - Date to format
 * @returns {string} - Formatted date string
 */
function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Sanitize user input
 * @param {string} input - Raw user input
 * @returns {string} - Sanitized output
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Create a data table from array data
 * @param {Array} data - Array of objects to display
 * @param {Array} columns - Column definitions
 * @returns {HTMLTableElement} - Created table element
 */
function createDataTable(data, columns) {
  const table = document.createElement('table');
  table.className = 'data-table';

  // Create header
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  columns.forEach(col => {
    const th = document.createElement('th');
    th.textContent = col.label || col.key;
    th.style.width = col.width || 'auto';
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Create body
  const tbody = document.createElement('tbody');
  data.forEach(item => {
    const tr = document.createElement('tr');
    columns.forEach(col => {
      const td = document.createElement('td');
      td.textContent = item[col.key] !== undefined ? item[col.key] : '';
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  return table;
}

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_025: Add other accessibility changes as per the insight report
// - [NEW] ADD YOUR CODE HERE if any other issues need to be addressed

const React = require('react');
const ReactDOM = require('react-dom');

// Assuming the following functions have been implemented in a separate file or in the same file
const {
  addLangAttribute,
  fixTableStructure,
  fixLandmarkIssues,
  addMainLandmark,
  addLandmarkRegions,
  ensureUniqueLandmarks,
  uniqueLandmarks,
  addSvgAccessibleNames,
  addAccessibleNamesToSVGs,
  fixFakeLinkIssue,
  fixFakeLinkIssues,
  googleSignIn,
  fixButtonIdentifiers
} = require('./accessibility-utils');

/**
 * Ensures the dependencyGraph container has a proper ARIA role
 * This addresses the accessibility issue mentioned in the insight report
 */
function ensureDependencyGraphContainerHasAriaRole() {
  const dependencyGraph = document.getElementById('dependencyGraph') || 
                          document.querySelector('[data-dependency-graph]') ||
                          document.querySelector('.dependency-graph');
  
  if (dependencyGraph) {
    // Set appropriate ARIA role based on the container's purpose
    if (!dependencyGraph.getAttribute('role')) {
      dependencyGraph.setAttribute('role', 'img');
    }
    
    // Ensure it has an accessible name
    const existingLabel = dependencyGraph.getAttribute('aria-label') || 
                          dependencyGraph.getAttribute('aria-labelledby');
    
    if (!existingLabel) {
      const label = document.createElement('span');
      label.id = 'dependency-graph-label';
      label.textContent = 'Dependency Graph';
      label.style.position = 'absolute';
      label.style.width = '1px';
      label.style.height = '1px';
      label.style.padding = '0';
      label.style.margin = '-1px';
      label.style.overflow = 'hidden';
      label.style.clip = 'rect(0, 0, 0, 0)';
      label.style.whiteSpace = 'nowrap';
      label.style.border = '0';
      dependencyGraph.setAttribute('aria-labelledby', 'dependency-graph-label');
      dependencyGraph.style.position = 'relative';
      dependencyGraph.insertBefore(label, dependencyGraph.firstChild);
    }
  }
}

function addressAccessibilityIssues() {
  ensureDependencyGraphContainerHasAriaRole();
}

const App = () => {
  // ... existing code ...

  // Example of adding lang attribute to the HTML element
  addLangAttribute('en');

  // Example of fixing table structure issues
  fixTableStructure();

  // Example of adding/fixing landmark issues
  fixLandmarkIssues();
  addMainLandmark();
  addLandmarkRegions();

  // Example of ensuring unique landmarks
  ensureUniqueLandmarks();
  uniqueLandmarks();

  // Example of adding accessible names to SVGs
  addSvgAccessibleNames();
  addAccessibleNamesToSVGs();

  // Example of fixing fake link issues
  fixFakeLinkIssue();
  fixFakeLinkIssues();

  // Example of Google sign-in logic
  googleSignIn();

  // Example of replacing 'my-button' with an actual button id for accessibility
  fixButtonIdentifiers();

  addressAccessibilityIssues();

  return (
    // ... JSX code ...
    React.createElement('div', null, 'App Content')
  );
};

ReactDOM.render(React.createElement(App), document.getElementById('root'));

/**
 * Export functions for testing and external use
 */
module.exports = {
  config,
  checkTableStructure,
  formatDate,
  sanitizeInput,
  createDataTable,
  ensureDependencyGraphContainerHasAriaRole,
  addressAccessibilityIssues
};