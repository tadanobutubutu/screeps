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
  apiUrl: process.env.API_URL || 'http://localhost:3000',
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
    const headerCells = thead.querySelectorAll('th');
    result.columnCount = headerCells.length;
  }

  // Validate row consistency
  const targetRow = tbody ? tbody.querySelector('tr') : allRows[0];
  const firstRowCells = targetRow ? targetRow.querySelectorAll('th, td') : [];
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

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_025: Add other accessibility changes as per the insight report
// - [NEW] ADD YOUR CODE HERE if any other issues need to be addressed

const React = require('react');
const ReactDOM = require('react-dom');

// Accessibility functions implementation
function addLangAttribute(lang) {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang;
  }
}

function fixTableStructure(table) {
  if (!table) return false;
  
  // Ensure table has proper accessibility attributes
  if (!table.getAttribute('role')) {
    table.setAttribute('role', 'table');
  }
  
  // Ensure headers have scope attributes
  const headers = table.querySelectorAll('thead th');
  headers.forEach((header, index) => {
    if (!header.getAttribute('scope')) {
      header.setAttribute('scope', 'col');
    }
    if (!header.getAttribute('id')) {
      header.setAttribute('id', `header-${index}`);
    }
  });
  
  // Associate data cells with headers
  const rows = table.querySelectorAll('tbody tr');
  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('td');
    cells.forEach((cell, cellIndex) => {
      if (!cell.getAttribute('headers')) {
        cell.setAttribute('headers', `header-${cellIndex}`);
      }
    });
  });
  
  return true;
}

function fixLandmarkIssues() {
  // Fix duplicate landmark issues
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length > 1) {
    mainElements.forEach((el, index) => {
      if (index > 0) {
        el.removeAttribute('role');
      }
    });
  }
}

function addMainLandmark() {
  if (typeof document === 'undefined') return;
  
  const main = document.querySelector('main');
  if (!main) {
    const newMain = document.createElement('main');
    newMain.setAttribute('id', 'main-content');
    document.body.insertBefore(newMain, document.body.firstChild);
  } else {
    if (!main.getAttribute('id')) {
      main.setAttribute('id', 'main-content');
    }
  }
}

function addLandmarkRegions() {
  if (typeof document === 'undefined') return;
  
  const requiredLandmarks = ['header', 'nav', 'main', 'footer'];
  requiredLandmarks.forEach(landmark => {
    if (!document.querySelector(landmark)) {
      const el = document.createElement(landmark);
      document.body.appendChild(el);
    }
  });
}

function ensureUniqueLandmarks() {
  if (typeof document === 'undefined') return;
  
  const landmarks = ['nav', 'main', 'footer', 'aside'];
  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(landmark);
    if (elements.length > 1) {
      elements.forEach((el, index) => {
        if (index === 0) {
          el.setAttribute('aria-label', `${landmark} primary`);
        } else {
          el.setAttribute('aria-label', `${landmark} secondary ${index}`);
        }
      });
    }
  });
}

function uniqueLandmarks() {
  ensureUniqueLandmarks();
}

function addSvgAccessibleNames() {
  if (typeof document === 'undefined') return;
  
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
      svg.setAttribute('aria-label', `Icon ${index + 1}`);
    }
  });
}

function addAccessibleNamesToSVGs() {
  addSvgAccessibleNames();
}

function fixFakeLinkIssue() {
  if (typeof document === 'undefined') return;
  
  const fakeLinks = document.querySelectorAll('[role="link"], a[href="#"], a[href=""]');
  fakeLinks.forEach(link => {
    if (!link.getAttribute('tabindex')) {
      link.setAttribute('tabindex', '0');
    }
    if (!link.getAttribute('href')) {
      link.setAttribute('href', 'javascript:void(0)');
    }
  });
}

function fixFakeLinkIssues() {
  fixFakeLinkIssue();
}

function googleSignIn() {
  // Google Sign-In accessibility handling
  const googleButtons = document.querySelectorAll('[data-gid]');
  googleButtons.forEach(button => {
    if (!button.getAttribute('aria-label')) {
      button.setAttribute('aria-label', 'Sign in with Google');
    }
  });
}

function fixButtonIdentifiers() {
  if (typeof document === 'undefined') return;
  
  const buttons = document.querySelectorAll('button');
  buttons.forEach((button, index) => {
    if (!button.getAttribute('id') && !button.textContent.trim()) {
      button.setAttribute('id', `button-${index}`);
    }
  });
}

function addressAccessibilityIssues() {
  // Main function to address all accessibility issues
  addLangAttribute('en');
  fixLandmarkIssues();
  addMainLandmark();
  addLandmarkRegions();
  ensureUniqueLandmarks();
  uniqueLandmarks();
  addSvgAccessibleNames();
  addAccessibleNamesToSVGs();
  fixFakeLinkIssue();
  fixFakeLinkIssues();
  googleSignIn();
  fixButtonIdentifiers();
}

const App = () => {
  // ... existing code ...

  // Example of adding lang attribute to the HTML element
  addLangAttribute('en');

  // Example of fixing table structure issues
  const tables = document.querySelectorAll('table');
  tables.forEach(table => fixTableStructure(table));

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

  return null;
  // ... JSX code ...
};

ReactDOM.render(React.createElement(App), document.getElementById('root'));

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
  addLangAttribute,
  fixTableStructure,
  fixLand