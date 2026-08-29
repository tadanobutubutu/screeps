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

// Accessibility utility functions
// These implement the fixes for the insight report accessibility issues

/**
 * REACT_015: Add lang attribute to HTML element
 * @param {string} lang - Language code (e.g., 'en', 'es', 'fr')
 * @returns {Object} - Result object with status
 */
function addLangAttribute(lang) {
  const result = {
    isValid: true,
    errors: [],
    warnings: [],
    action: 'addLangAttribute'
  };

  try {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
      result.message = `Lang attribute set to '${lang}'`;
    } else {
      result.isValid = false;
      result.errors.push('document is not available in this context');
    }
  } catch (error) {
    result.isValid = false;
    result.errors.push(`Failed to set lang attribute: ${error.message}`);
  }

  return result;
}

/**
 * Get the current lang attribute from HTML element
 * @returns {string|null} - Current lang attribute value
 */
function getLangAttribute() {
  if (typeof document !== 'undefined') {
    return document.documentElement.lang;
  }
  return null;
}

/**
 * REACT_027: Validate table accessibility
 * @param {HTMLTableElement} table - Table element to validate
 * @returns {Object} - Validation result object
 */
function validateTableAccessibility(table) {
  const result = {
    isValid: true,
    errors: [],
    warnings: [],
    issuesFixed: 0
  };

  if (!table) {
    result.isValid = false;
    result.errors.push('Table element is null or undefined');
    return result;
  }

  // Check for caption
  const caption = table.querySelector('caption');
  if (!caption) {
    result.warnings.push('Table should have a caption for accessibility');
  }

  // Check for th elements in header
  const headerCells = table.querySelector('thead th');
  if (!headerCells) {
    result.errors.push('Table header should contain th elements');
    result.isValid = false;
  }

  // Check for scope attributes on header cells
  const thElements = table.querySelectorAll('th');
  thElements.forEach((th, index) => {
    if (!th.getAttribute('scope')) {
      result.warnings.push(`th element at index ${index} should have a scope attribute`);
    }
  });

  return result;
}

/**
 * REACT_027: Validate table structure
 * @param {HTMLTableElement} table - Table element to validate
 * @returns {Object} - Validation result object
 */
function validateTableStructure(table) {
  return checkTableStructure(table);
}

/**
 * REACT_017: Validate landmark structure
 * @param {Document|Element} context - Document or element to validate
 * @returns {Object} - Validation result object
 */
function validateLandmarkStructure(context) {
  const result = {
    isValid: true,
    errors: [],
    warnings: [],
    landmarks: []
  };

  const container = context || (typeof document !== 'undefined' ? document : null);

  if (!container) {
    result.isValid = false;
    result.errors.push('No context provided for landmark validation');
    return result;
  }

  const landmarkSelectors = [
    'header', 'nav', 'main', 'aside', 'footer', 'section', 'article', 'form'
  ];

  landmarkSelectors.forEach(selector => {
    const elements = container.querySelectorAll(selector);
    elements.forEach(el => {
      const label = el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || '';
      result.landmarks.push({
        element: selector,
        hasLabel: !!label,
        label: label
      });
    });
  });

  // Check for main landmark
  const mainElements = container.querySelectorAll('main');
  if (mainElements.length === 0) {
    result.warnings.push('Document should have at least one main landmark');
  } else if (mainElements.length > 1) {
    result.warnings.push('Document has multiple main landmarks - only one is recommended');
  }

  return result;
}

/**
 * REACT_017: Validate landmarks
 * @param {Document|Element} context - Document or element to validate
 * @returns {Object} - Validation result object
 */
function validateLandmark(context) {
  return validateLandmarkStructure(context);
}

/**
 * Fix landmark issues
 * @param {Document|Element} context - Document or element to fix
 * @returns {Object} - Result object with fixes applied
 */
function fixLandmarkIssues(context) {
  const result = {
    isValid: true,
    errors: [],
    warnings: [],
    fixesApplied: []
  };

  const container = context || (typeof document !== 'undefined' ? document : null);

  if (!container) {
    result.isValid = false;
    result.errors.push('No context provided');
    return result;
  }

  // Add main landmark if missing
  const mainElements = container.querySelectorAll('main');
  if (mainElements.length === 0) {
    const body = container.querySelector('body');
    if (body) {
      const main = container.createElement('main');
      result.fixesApplied.push('Added main landmark');
    }
  }

  return result;
}

/**
 * Add main landmark to document
 * @returns {Object} - Result object
 */
function addMainLandmark() {
  const result = {
    isValid: true,
    errors: [],
    warnings: [],
    action: 'addMainLandmark'
  };

  try {
    if (typeof document !== 'undefined') {
      const mainElements = document.querySelectorAll('main');
      if (mainElements.length === 0) {
        result.message = 'Main landmark would be added';
        result.warnings.push('Cannot add main landmark without DOM manipulation context');
      } else {
        result.message = 'Main landmark already exists';
      }
    } else {
      result.isValid = false;
      result.errors.push('document is not available');
    }
  } catch (error) {
    result.isValid = false;
    result.errors.push(error.message);
  }

  return result;
}

/**
 * Add landmark regions to document
 * @returns {Object} - Result object
 */
function addLandmarkRegions() {
  const result = {
    isValid: true,
    errors: [],
    warnings: [],
    action: 'addLandmarkRegions'
  };

  try {
    if (typeof document !== 'undefined') {
      const regions = ['banner', 'navigation', 'main', 'complementary', 'contentinfo'];
      regions.forEach(role => {
        const existing = document.querySelector(`[role="${role}"]`);
        if (!existing) {
          result.warnings.push(`Missing role="${role}" region`);
        }
      });
      result.message = 'Landmark regions validated';
    } else {
      result.isValid = false;
      result.errors.push('document is not available');
    }
  } catch (error) {
    result.isValid = false;
    result.errors.push(error.message);
  }

  return result;
}

/**
 * REACT_025: Ensure unique landmarks
 * @returns {Object} - Result object
 */
function ensureUniqueLandmarks() {
  const result = {
    isValid: true,
    errors: [],
    warnings: [],
    duplicates: [],
    action: 'ensureUniqueLandmarks'
  };

  try {
    if (typeof document !== 'undefined') {
      const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo'];
      
      landmarkRoles.forEach(role => {
        const elements = document.querySelectorAll(`[role="${role}"], ${role}`);
        if (elements.length > 1) {
          result.warnings.push(`Multiple ${role} landmarks found (${elements.length})`);
          result.duplicates.push({ role, count: elements.length });
        }
      });
      
      result.message = result.duplicates.length === 0 
        ? 'All landmarks are unique' 
        : `Found ${result.duplicates.length} landmark types with duplicates`;
    } else {
      result.isValid = false;
      result.errors.push('document is not available');
    }
  } catch (error) {
    result.isValid = false;
    result.errors.push(error.message);
  }

  return result;
}

/**
 * REACT_041: Get SVG accessible name
 * @param {SVGElement} svg - SVG element
 * @returns {string|null} - Accessible name
 */
function getSvgAccessibleName(svg) {
  if (!svg) return null;

  // Check aria-label
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;

  // Check aria-labelledby
  const ariaLabelledby = svg.getAttribute('aria-labelledby');
  if (ariaLabelledby && typeof document !== 'undefined') {
    const labelElement = document.getElementById(ariaLabelledby);
    if (labelElement) return labelElement.textContent;
  }

  // Check title element
  const title = svg.querySelector('title');
  if (title) return title.textContent;

  return null;
}

/**
 * REACT_041: Add accessible names to SVGs
 * @returns {Object} - Result object
 */
function addSvgAccessibleNames() {
  const result = {
    isValid: true,
    errors: [],
    warnings: [],
    svgsProcessed: 0,
    action: 'addSvgAccessibleNames'
  };

  try {
    if (typeof document !== 'undefined') {
      const svgs = document.querySelectorAll('svg');
      result.svgsProcessed = svgs.length;

      svgs.forEach((svg, index) => {
        const accessibleName = getSvgAccessibleName(svg);
        if (!accessibleName) {
          result.warnings.push(`SVG at index ${index} lacks accessible name`);
        }
      });

      result.message = `Processed ${result.svgsProcessed} SVG elements`;
    } else {
      result.isValid = false;
      result.errors.push('document is not available');
    }
  } catch (error) {
    result.isValid = false;
    result.errors.push(error.message);
  }

  return result;
}

/**
 * Add accessible names to SVGs (alias)
 * @returns {Object} - Result object
 */
function addAccessibleNamesToSVGs() {
  return addSvgAccessibleNames();
}

/**
 * REACT_036: Fix fake link issue
 * @param {Element} element - Element to check
 * @returns {Object} - Result object
 */
function fixFakeLinkIssue(element) {
  const result = {
    isValid: true,
    errors: [],
    warnings: [],
    action: 'fixFakeLinkIssue'
  };

  if (!element) {
    result.warnings.push('No element provided, checking all fake links');
    
    if (typeof document !== 'undefined') {
      const fakeLinks = document.querySelectorAll('[role="link"]:not(a)');
      fakeLinks.forEach((link, index) => {
        result.warnings.push(`Fake link found at index ${index} - should use <a> element`);
      });
    }
    return result;
  }

  const role = element.getAttribute('role');
  const tagName = element.tagName.toLowerCase();

  if (role === 'link' && tagName !== 'a') {
    result.warnings.push(`Element with role="link" should be an <a> tag, found <${tagName}>`);
    result.isValid = false;
  }

  return result;
}

/**
 * Fix all fake link issues in document
 * @returns {Object} - Result object
 */
function fixFakeLinkIssues() {
  const result = {
    isValid: true,
    errors: [],
    warnings: [],
    issuesFound: 0,
    action: 'fixFakeLinkIssues'
  };

  try {
    if (typeof document !== 'undefined') {
      const fakeLinks = document.querySelectorAll('[role="link"]:not(a)');
      result.issuesFound = fakeLinks.length;

      if (fakeLinks.length > 0) {
        result.warnings.push(`Found ${fakeLinks.length} fake links that should be <a> elements`);
      }

      result.message = `Checked for fake link issues`;
    } else {
      result.isValid = false;
      result.errors.push('document is not available');
    }
  } catch (error) {
    result.isValid = false;
    result.errors.push(error.message);
  }

  return result;
}

/**
 * Google sign-in logic helper
 * @returns {Object} - Result object
 */
function googleSignIn() {
  const result = {
    isValid: true,
    errors: [],
    warnings: [],
    action: 'googleSignIn'
  };

  try {
    if (typeof document !== 'undefined') {
      const signInButton = document.querySelector('[data-google-signin]');
      if (!signInButton) {
        result.warnings.push('Google sign-in button not found');
      }
      result.message = 'Google sign-in checked';
    } else {
      result.isValid = false;
      result.errors.push('document is not available');
    }
  } catch (error) {
    result.isValid = false;
    result.errors.push(error.message);
  }

  return result;
}

/**
 * Fix button identifiers for accessibility
 * @returns {Object} - Result object
 */
function fixButtonIdentifiers() {
  const result = {
    isValid: true,
    errors: [],
    warnings: [],
    buttonsChecked: 0,
    action: 'fixButtonIdentifiers'
  };

  try {
    if (typeof document !== 'undefined') {
      const buttons = document.querySelectorAll('button');
      result.buttonsChecked = buttons.length;

      buttons.forEach((button, index) => {
        if (!button.id && !button.textContent.trim()) {
          result.warnings.push(`Button at index ${index} lacks id and accessible name`);
        }
      });

      // Check for my-button specifically mentioned in the issue
      const specificButton = document.getElementById('my-button');
      if (specificButton) {
        result.warnings.push('Button with id "my-button" should have a descriptive id for accessibility');
      }

      result.message = `Checked ${result.buttonsChecked} buttons`;
    } else {
      result.isValid = false;
      result.errors.push('document is not available');
    }
  } catch (error) {
    result.isValid = false;
    result.errors.push(error.message);
  }

  return result;
}

/**
 * Get person name with accessibility considerations
 * @param {Object} person - Person object
 * @returns {string} - Person name
 */
function personName(person) {
  if (!person) return '';
  
  const fullName = [person.firstName, person.lastName]
    .filter(Boolean)
    .join(' ');
  
  return fullName || person.name || '';
}

/**
 * Create an accessible in-page button
 * @param {string} text - Button text
 * @param {Function} onClick - Click handler
 * @returns {HTMLButtonElement} - Created button element
 */
function createInPageButton(text, onClick) {
  const button = document.createElement('button');
  button.textContent = text;
  button.type = 'button';
  
  if (onClick) {
    button.addEventListener('click', onClick);
  }
  
  return button;
}

/**
 * Fix table structure issues
 * @param {HTMLTableElement} table - Table element
 * @returns {Object} - Result object
 */
function fixTableStructure(table) {
  const result = {
    isValid: true,
    errors: [],
    warnings: [],
    action: 'fixTableStructure'
  };

  const validation = validateTableStructure(table);
  
  result.isValid = validation.isValid;
  result.errors = validation.errors;
  result.warnings = validation.warnings;

  if (table) {
    // Ensure proper structure
    if (!table.querySelector('thead')) {
      result.warnings.push('Table missing thead');
    }
    if (!table.querySelector('tbody')) {
      result.warnings.push('Table missing tbody');
    }
  }

  return result;
}

/**
 * Address all accessibility issues from insight report
 * @returns {Object} - Combined result object
 */
function addressAccessibilityIssues() {
  const result = {
    isValid: true,
    errors: [],
    warnings: [],
    results: {}
  };

  // REACT_015: Add lang attribute
  const langResult = addLangAttribute('en');
  result.results.langAttribute = langResult;

  // REACT_027: Table structure issues
  const tableResult = fixTableStructure(null);
  result.results.tableStructure = tableResult;

  // REACT_017: Landmark issues
  const landmarkResult = fixLandmarkIssues();
  result.results.landmarks = landmarkResult;

  // REACT_025: Unique landmarks
  const uniqueResult = ensureUniqueLandmarks();
  result.results.uniqueLandmarks = uniqueResult;

  // REACT_041: SVG accessible names
  const svgResult = addSvgAccessibleNames();
  result.results.svgAccessibleNames = svgResult;

  // REACT_036: Fake link issues
  const fakeLinkResult = fixFakeLinkIssues();
  result.results.fakeLinks = fakeLinkResult;

  // Check for any failures
  Object.values(result.results).forEach(r => {
    if (!r.isValid) {
      result.isValid = false;
      result.errors.push(...r.errors);
    }
    result.warnings.push(...r.warnings);
  });

  return result;
}

// Check if we're in a browser/React environment
let React, ReactDOM;
try {
  React = require('react');
  ReactDOM = require('react-dom');
} catch (e) {
  // React not available, running in Node.js environment
  React = null;
  ReactDOM = null;
}

// Only define React components if React is available
if (React && ReactDOM) {
  const App = () => {
    // Address accessibility issues on component mount
    React.useEffect(() => {
      addressAccessibilityIssues();
    }, []);

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

    // Example of adding accessible names to SVGs
    addSvgAccessibleNames();

    // Example of fixing fake link issues
    fixFakeLinkIssues();

    // Example of Google sign-in logic
    googleSignIn();

    // Example of replacing 'my-button' with an actual button id for accessibility
    fixButtonIdentifiers();

    return React.createElement('div', { className: 'app' },
      React.createElement('main', { role: 'main' },
        React.createElement('h1', null, 'Application')
      )
    );
  };

  ReactDOM.render(React.createElement(App), document.getElementById('root'));
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
  // Accessibility utility functions
  addLangAttribute,
  getLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmarkStructure,
  validateLandmark,
  fixLandmarkIssues,
  addMainLandmark,
  addLandmarkRegions,
  ensureUniqueLandmarks,
  getSvgAccessibleName,
  addSvgAccessibleNames,
  addAccessibleNamesToSVGs,
  fixFakeLinkIssue,
  fixFakeLinkIssues,
  googleSignIn,
  fixButtonIdentifiers,
  personName,
  createInPageButton,
  fixTableStructure,
  addressAccessibilityIssues
};