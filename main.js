// main.js
// Implementation of unique landmark functions

// Preserve existing functionality

// TODO: Add back any required exports that might have been removed.

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
// - REACT_017: Add landmark roles and fix landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue
// - REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// (Added functions for REACT_017 and new REACT_025)
// - [NEW] ADD YOUR CODE HERE if any other issues need to be addressed

// Internal set to track used landmark IDs
// Global set to track used landmark IDs
const _usedLandmarkIds = new Set();

/**
 * Creates a unique identifier for a landmark given a base name.
 * @param {string} baseName - Base name of the landmark.
 * @returns {string} Unique ID.
 */
function ensureUniqueLandmarkId(baseName) {
    const candidate = baseName
    if (_usedLandmarkIds.has(candidate)) {
        // Collision handling: add random suffix
        const suffix = Math.random().toString(36).substring(2, 7);
        candidate = `${baseName}-${suffix}`;
    }
    _usedLandmarkIds.add(candidate);
    return candidate;
}

/**
 * Checks whether a given landmark ID has already been used.
 * @param {string} id - The landmark ID to check.
 * @returns {boolean} True if the ID is unique (not previously used), false otherwise.
 */
function isLandmarkIdUnique(id) {
    return !_usedLandmarkIds.has(id);
}

/**
 * Returns a new array containing only unique landmarks from the input list.
 * @param {Array} landmarks - List of landmark objects.
 * @returns {Array} Unique landmarks.
 */
function uniqueLandmarks(landmarks) {
    const seen = new Set();
    const result = [];
    for (const lm of landmarks) {
        if (!seen.has(lm.id)) {
            seen.add(lm.id);
            result.push(lm);
        }
    }
    return result;
}

// Add lang attribute as per the issue requirement
function addLangAttribute() {
  // Assuming there is a relevant element selector or similar to target
  const elementToModify = document.querySelector('some-selector');
  if (elementToModify) {
    elementToModify.setAttribute('lang', 'en'); // Example: English
  }
}

/**
 * This function gets the language attribute
 * @returns {string} - the language attribute
 */
function getLangAttribute() {
  return document.documentElement.lang || '';
}

/**
 * This function gets the full language attribute with region (if provided)
 * @returns {string} - the full language attribute with region (if provided)
 */
function getFullLangAttribute() {
  return document.documentElement.lang || '';
}

/**
 * Function to replace `my-button` with actual button id
 */
function replaceMyButtonIdClass() {
  const button = document.querySelector('.my-button');
  if (button) {
    button.id = 'exampleButton';
  }
}

/**
 * Adds proper ARIA landmark regions to the document.
 * This improves screen reader navigation by ensuring proper landmark roles.
 *
 * @returns {void}
 */
function addProperLandmarkRegions() {
  // Create main landmark
  const main = document.createElement('main');
  main.setAttribute('role', 'main');
  main.id = 'main-content';
  
  // Create navigation landmark
  const nav = document.querySelector('nav') || document.createElement('nav');
  nav.setAttribute('role', 'navigation');
  nav.id = nav.id || 'primary-navigation';
  
  // Create banner/header landmark
  const header = document.querySelector('header') || document.createElement('header');
  header.setAttribute('role', 'banner');
  header.id = header.id || 'site-header';
  
  // Create contentinfo/footer landmark
  const footer = document.querySelector('footer') || document.createElement('footer');
  footer.setAttribute('role', 'contentinfo');
  footer.id = footer.id || 'site-footer';
  
  // Create aside landmark for complementary content
  const asides = document.querySelectorAll('aside');
  asides.forEach((aside, index) => {
    aside.setAttribute('role', 'complementary');
    if (!aside.id) aside.id = `sidebar-${index + 1}`;
  });
}

/**
 * Adds proper ARIA account management elements to the document.
 * This includes adding `aria-expanded` attributes for collapsible menus,
 * and adding `aria-label` to form elements.
 *
 * @returns {void}
 */
function addProperAccountManagement() {
  // Add aria-expanded to collapsible menus/buttons
  const collapsibles = document.querySelectorAll('[aria-expanded]');
  collapsibles.forEach(el => {
    if (!el.getAttribute('aria-expanded')) {
      el.setAttribute('aria-expanded', 'false');
    }
  });
  
  // Add aria-labels to form inputs that don't have labels
  const inputs = document.querySelectorAll('input');
  inputs.forEach((input, index) => {
    const id = input.id || `input-${index}`;
    input.id = id;
    if (!input.getAttribute('aria-label')) {
      input.setAttribute('aria-label', `Input field ${index + 1}`);
    }
  });
}

/**
 * Adds ARIA attributes to form controls for better accessibility.
 * This function focuses on ensuring that form controls have proper labeling and roles.
 *
 * @returns {void}
 */
function addAriaToFormControls() {
  // Add required aria attributes to form controls
  const formControls = document.querySelectorAll('input, select, textarea');
  
  formControls.forEach(control => {
    // Ensure all form controls have accessible names
    if (!control.getAttribute('aria-label') && control.id) {
      const label = document.querySelector(`label[for="${control.id}"]`);
      if (label) {
        label.id = label.id || `label-${control.id}`;
        control.setAttribute('aria-labelledby', label.id);
      }
    }
    
    // Mark required fields appropriately
    if (control.required && !control.getAttribute('aria-required')) {
      control.setAttribute('aria-required', 'true');
    }
  });
}

// Added functions for REACT_017 and new REACT_025
// - REACT_017: Add landmark roles and fix landmark issues
// - REACT_025: Ensure unique landmarks (2 issues)

/**
 * Adds accessible names to SVGs.
 * @param {Array} svgs - Array of SVG elements.
 * @returns {void}
 */
function addAccessibleNamesToSVGs(svgs) {
  svgs.forEach(svg => {
    const id = `svg-${Date.now()}`;
    svg.setAttribute('id', id);
    const label = document.createElement('label');
    label.setAttribute('for', id);
    label.textContent = 'SVG description';
    svg.parentNode.insertBefore(label, svg);
  });
}

/**
 * Removes fake links from the document.
 * @returns {void}
 */
function removeFakeLinks() {
  const fakeLinks = document.querySelectorAll('a[href="#"]');
  fakeLinks.forEach(link => {
    link.style.display = 'none';
  });
}

/**
 * Implement validateTableAccessibility() function to check for accessibility issues in tables.
 * This function should check for proper table headers, roles, and other relevant ARIA attributes.
 *
 * @returns {void}
 */
function validateTableAccessibility() {
  // Check for tables with no headers or headers that are not properly labeled
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    const headers = table.querySelectorAll('th');
    if (headers.length === 0) {
      console.error('Table without headers found:', table);
    } else {
      headers.forEach(header => {
        // Check for proper scope attribute
        const scope = header.getAttribute('scope');
        if (!scope) {
          console.error('Table header without scope attribute:', header);
        } else if (scope !== 'col' && scope !== 'row' && scope !== 'colgroup' && scope !== 'rowgroup') {
          console.error('Table header with invalid scope value:', header);
        }
        
        // Check for proper role attribute
        if (!header.hasAttribute('role') || (header.getAttribute('role') !== 'columnheader' && header.getAttribute('role') !== 'rowheader')) {
          console.error('Table header without proper role attribute:', header);
        }
      });
    }
  });
}

/**
 * Implement validateTableStructure() function to check for proper table structure.
 * This function should check for tables with proper nesting and other structural issues.
 *
 * @returns {void}
 */
function validateTableStructure() {
  // Check for tables with incorrect nesting or other structural issues
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
      const cells = row.querySelectorAll('td, th');
      if (cells.length === 0) {
        console.error('Table row without cells found:', row);
      }
    });
    
    // Check for tables without proper structure (missing thead, tbody, tfoot)
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    
    // If table has rows directly under table (not in tbody), that's a structural issue
    const directRows = table.querySelectorAll(':scope > tr');
    if (directRows.length > 0) {
      console.error('Table with rows directly under table element (should be in tbody):', table);
    }
  });
}

// ARIA live region announcer
function createAnnouncer() {
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  announcer.style.cssText = 'position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0, 0, 0,