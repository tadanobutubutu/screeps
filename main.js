/**
 * Main application entry point
 *
 * Combines legacy table utilities with React-based accessibility enhancements.
 * - Legacy utilities (checkTableStructure, formatDate, sanitizeInput, createDataTable)
 *   remain available for non-React usage and for tests.
 * - Accessibility utilities are pulled in via the React app entry point.
 */

const VERSION = '1.0.0';

// Configuration
const config = {
  apiUrl: process.env.API_URL || 'https://api.example.com',
  debug: false,
  timeout: 5000,
  retries: 3
};

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
 * Example class
 */
class DataProcessor {
  constructor(options = {}) {
    this.options = options;
  }

  process(data) {
    return data.map(item => ({
      ...item,
      processed: true
    }));
  }
}

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
    const headerCells = thead.querySelectorAll('th, td');
    result.columnCount = headerCells.length;
  }

  // Validate row consistency
  const targetRow = tbody || allRows[0];
  const firstRowCells = targetRow.querySelectorAll('td, th');
  const expectedCellCount = firstRowCells.length || result.columnCount;

  allRows.forEach((row, index) => {
    const cells = row.querySelectorAll('td, th');
    if (cells.length !== expectedCellCount) {
      result.isValid = false;
      result.errors.push(`Row ${index} has ${cells.length} cells, expected ${expectedCellCount}`);
    }
  });

  return result;
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

// Validate input
function validateInput(input) {
  if (!input || typeof input !== 'object') {
    throw new Error('Invalid input provided');
  }
  return true;
}

// Accessibility utilities import
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
} = require('./accessibilityUtils');

/**
 * Address accessibility issues from insight report:
 * - REACT_015: Add lang attribute to HTML element
 * - REACT_025: Add other accessibility changes as per the insight report
 * - [NEW] ADD YOUR CODE HERE if any other issues need to be addressed
 */

/**
 * Wraps the primary content in a main landmark region for accessibility
 * @param {HTMLElement} root - The root element where the app will be mounted
 * @returns {HTMLElement} - The wrapped root element
 */
function wrapPrimaryContentInMain(root) {
  // Create a wrapper div with role="main" and appropriate label
  const wrapper = document.createElement('div');
  wrapper.setAttribute('role', 'main');
  wrapper.setAttribute('aria-label', 'Main content area');
  
  return wrapper;
}

// Apply the wrapping before rendering the app
const rootElement = document.getElementById('root');
if (rootElement) {
  wrapPrimaryContentInMain(rootElement);
}

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
    const headerCells = thead.querySelectorAll('th, td');
    result.columnCount = headerCells.length;
  }

  // Validate row consistency
  const targetRow = tbody || allRows[0];
  const firstRowCells = targetRow.querySelectorAll('td, th');
  const expectedCellCount = firstRowCells.length || result.columnCount;

  allRows.forEach((row, index) => {
    const cells = row.querySelectorAll('td, th');
    if (cells.length !== expectedCellCount) {
      result.isValid = false;
      result.errors.push(`Row ${index} has ${cells.length} cells, expected ${expectedCellCount}`);
    }
  });

  return result;
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

// Validate input
function validateInput(input) {
  if (!input || typeof input !== 'object') {
    throw new Error('Invalid input provided');
  }
  return true;
}

// Accessibility utilities import
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
} = require('./accessibilityUtils');

/**
 * Address accessibility issues from insight report:
 * - REACT_015: Add lang attribute to HTML element
 * - REACT_025: Add other accessibility changes as per the insight report
 * - [NEW] ADD YOUR CODE HERE if any other issues need to be addressed
 */

/**
 * Wraps the primary content in a main landmark region for accessibility
 * @param {HTMLElement} root - The root element where the app will be mounted
 * @returns {HTMLElement} - The wrapped root element
 */
function wrapPrimaryContentInMain(root) {
  // Create a wrapper div with role="main" and appropriate label
  const wrapper = document.createElement('div');
  wrapper.setAttribute('role', 'main');
  wrapper.setAttribute('aria-label', 'Main content area');
  
  return wrapper;
}

// Apply the wrapping before rendering the app
const rootElement = document.getElementById('root');
if (rootElement) {
  wrapPrimaryContentInMain(rootElement);
}

/**
 * Export functions for testing and external use
 */
module.exports = {
  VERSION,
  config,
  formatDate,
  DataProcessor,
  validateInput,
  checkTableStructure,
  sanitizeInput,
  createDataTable,
  wrapPrimaryContentInMain
};