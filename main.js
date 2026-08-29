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
    const headerCells = thead.querySelectorAll('td');
    result.columnCount = headerCells.length;
  }

  // Validate row consistency
  const targetRow = tbody || allRows[0];
  const firstRowCells = targetRow.querySelectorAll('th');
  const expectedCellCount = firstRowCells.length || result.columnCount;

  allRows.forEach((row, index) => {
    const cells = row.querySelectorAll('th');
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

// Accessibility utility functions for insight report items

/**
 * REACT_015: Add lang attribute to HTML element
 * @param {string} lang - Language code (e.g., 'en', 'es')
 */
function addLangAttribute(lang) {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang || 'en';
  }
}

/**
 * REACT_027: Fix table structure issues
 * @param {HTMLTableElement} table - The table to fix
 * @returns {Object} - Result of fixes applied
 */
function fixTableStructure(table) {
  const result = { fixed: [], errors: [] };
  if (!table) {
    result.errors.push('Table element required');
    return result;
  }

  // Ensure thead exists if header rows are present
  const existingThead = table.querySelector('thead');
  const firstRow = table.querySelector('tr');
  if (firstRow && !existingThead) {
    const thead = document.createElement('thead');
    thead.appendChild(firstRow);
    table.insertBefore(thead, table.firstChild);
    result.fixed.push('Added missing thead element');
  }

  // Ensure tbody exists
  const existingTbody = table.querySelector('tbody');
  if (!existingTbody && table.querySelectorAll('tr').length > 0) {
    const tbody = document.createElement('tbody');
    const rows = table.querySelectorAll('tr');
    rows.forEach(row => tbody.appendChild(row));
    table.appendChild(tbody);
    result.fixed.push('Added missing tbody element');
  }

  return result;
}

/**
 * REACT_017: Add main landmark
 */
function addMainLandmark() {
  if (typeof document !== 'undefined') {
    const mainElements = document.querySelectorAll('main');
    if (mainElements.length === 0) {
      const main = document.createElement('main');
      main.setAttribute('id', 'main-content');
      main.setAttribute('role', 'main');
      document.body.insertBefore(main, document.body.firstChild);
    }
  }
}

/**
 * Add landmark regions to the page
 */
function addLandmarkRegions() {
  if (typeof document !== 'undefined') {
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    const nav = document.querySelector('nav');

    if (header && !header.getAttribute('role')) {
      header.setAttribute('role', 'banner');
    }
    if (footer && !footer.getAttribute('role')) {
      footer.setAttribute('role', 'contentinfo');
    }
    if (nav && !nav.getAttribute('role')) {
      nav.setAttribute('role', 'navigation');
    }
  }
}

/**
 * REACT_025: Ensure unique landmarks
 */
function ensureUniqueLandmarks() {
  if (typeof document !== 'undefined') {
    const landmarks = ['header', 'main', 'footer', 'nav', 'aside'];
    landmarks.forEach(role => {
      const elements = document.querySelectorAll(`[role="${role}"], ${role}`);
      if (elements.length > 1) {
        elements.forEach((el, index) => {
          if (index > 0 && el.getAttribute('role')) {
            el.removeAttribute('role');
          }
        });
      }
    });
  }
}

/**
 * Alternative function name for unique landmarks check
 */
function uniqueLandmarks() {
  ensureUniqueLandmarks();
}

/**
 * Fix landmark issues by ensuring proper landmark structure
 */
function fixLandmarkIssues() {
  addMainLandmark();
  addLandmarkRegions();
  ensureUniqueLandmarks();
}

/**
 * REACT_041: Add accessible names to SVGs
 * @param {string} selector - Selector for SVG elements
 * @param {string} description - Accessible description for SVGs
 */
function addSvgAccessibleNames(selector, description) {
  if (typeof document !== 'undefined') {
    const svgs = document.querySelectorAll(selector || 'svg');
    svgs.forEach((svg, index) => {
      if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
        const label = description || `SVG graphic ${index + 1}`;
        svg.setAttribute('aria-label', label);
      }
    });
  }
}

/**
 * Alternative function for adding accessible names to SVGs
 * @param {string} selector - CSS selector for SVGs
 * @param {string} description - Description to add
 */
function addAccessibleNamesToSVGs(selector, description) {
  addSvgAccessibleNames(selector, description);
}

/**
 * REACT_036: Fix fake link issue - convert fake links to proper buttons or anchors
 * @param {string} selector - Selector for fake link elements
 */
function fixFakeLinkIssue(selector) {
  if (typeof document !== 'undefined') {
    const fakeLinks = document.querySelectorAll(selector || 'a[href="#"], span[role="link"]');
    fakeLinks.forEach(el => {
      if (el.getAttribute('href') === '#' || el.getAttribute('role') === 'link') {
        // Add proper attributes or convert to button
        if (!el.getAttribute('role') && el.tagName === 'A') {
          el.setAttribute('role', 'button');
        }
        // Remove href="#" and replace with proper handling
        if (el.getAttribute('href') === '#') {
          el.setAttribute('href', 'javascript:void(0)');
        }
      }
    });
  }
}

/**
 * Fix multiple fake link issues
 * @param {string} selector - Selector for fake link elements
 */
function fixFakeLinkIssues(selector) {
  fixFakeLinkIssue(selector);
}

/**
 * Google sign-in logic placeholder
 */
function googleSignIn() {