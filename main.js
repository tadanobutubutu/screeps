function addressAccessibilityIssues() {
    // Add lang attribute to HTML element
    const htmlElement = document.documentElement;
    if (!htmlElement.hasAttribute('lang')) {
      htmlElement.setAttribute('lang', 'en');
    }

    // Fix table structure issues
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
      const headers = table.querySelectorAll('th');
      if (headers.length > 0) {
        headers.forEach(th => {
          if (!th.hasAttribute('scope')) {
            th.setAttribute('scope', 'col');
          }
        });
      }

      if (!table.querySelector('caption')) {
        const caption = document.createElement('caption');
        caption.textContent = 'Data table';
        table.insertBefore(caption, table.firstChild);
      }
    });

    // Ensure proper landmark usage
    const mainElements = document.querySelectorAll('main');
    if (mainElements.length === 0) {
      const main = document.createElement('main');
      const firstChild = document.body.firstChild;
      if (firstChild) {
        document.body.insertBefore(main, firstChild);
      } else {
        document.body.appendChild(main);
      }
    }

    const navElements = document.querySelectorAll('nav');
    navElements.forEach((nav, index) => {
      if (!nav.hasAttribute('aria-label') && !nav.querySelector('[role="navigation"]')) {
        nav.setAttribute('aria-label', `Navigation ${index + 1}`);
      }
    });

    // Add accessible names to SVGs
    const svgs = document.querySelectorAll('svg');
    svgs.forEach((svg, index) => {
      if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby')) {
        const title = svg.querySelector('title');
        if (title) {
          const existingId = title.getAttribute('id');
          if (!existingId) {
            const titleId = `svg-title-${Date.now()}-${index}`;
            title.setAttribute('id', titleId);
          }
        } else {
          const newTitle = document.createElement('title');
          newTitle.setAttribute('id', `svg-title-${Date.now()}-${index}`);
          newTitle.textContent = `SVG graphic ${index + 1}`;
          svg.insertBefore(newTitle, svg.firstChild);
        }
        svg.setAttribute('role', 'img');
      }
    });

    // Fix fake link issues (links that should be buttons)
    const fakeLinks = document.querySelectorAll('a[href*="javascript:"], a:not([href])');
    fakeLinks.forEach(link => {
      const isInteractive = link.getAttribute('onclick') || 
                          link.style.cursor === 'pointer' ||
                          link.classList.contains('button') ||
                          link.classList.contains('btn');
      
      if (isInteractive) {
        const button = document.createElement('button');
        button.className = link.className;
        button.textContent = link.textContent;
        button.setAttribute('type', 'button');
        
        if (link.getAttribute('onclick')) {
          button.setAttribute('onclick', link.getAttribute('onclick'));
        }
        
        link.parentNode.replaceChild(button, link);
      }
    });

    // Ensure unique IDs for interactive elements
    const interactiveElements = document.querySelectorAll('[id]');
    const seenIds = new Set();
    interactiveElements.forEach(el => {
      const id = el.getAttribute('id');
      if (seenIds.has(id)) {
        const newId = `${id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        el.setAttribute('id', newId);
      }
      seenIds.add(id);
    });

    // Fix button identifiers
    const buttons = document.querySelectorAll('button[id="my-button"], button[id="my_button"]');
    buttons.forEach(button => {
      button.removeAttribute('id');
    });
}
/**
 * Main entry point for the Web Accessibility Checker.
 * This file exports the core functionality used by the CLI and other modules.
 */

import { inspectElement } from './src/inspector.js';
import { generateReport } from './src/reporter.js';

/**
 * Divides two numbers with proper error handling.
 * Throws an error if the divisor is zero or if inputs are not valid numbers.
 * @param {number} a - The dividend.
 * @param {number} b - The divisor.
 * @returns {number} The result of the division.
 * @throws {Error} If inputs are not numbers or if divisor is zero.
 */
function divide(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new Error('Both arguments must be numbers');
  }
  if (b === 0) {
    throw new Error('Division by zero is not allowed');
  }
  return a / b;
}

/**
 * Checks a given DOM element for common accessibility violations.
 * @param {Element} element - The DOM element to evaluate.
 * @returns {Promise<Array>} A promise that resolves to an array of violation objects.
 */
export async function checkAccessibility(element) {
  const violations = [];
  
  if (!element) {
    return violations;
  }
  
  // Check if element is a table
  if (element.tagName && element.tagName.toLowerCase() === 'table') {
    // Check for caption (accessibility best practice)
    const caption = element.querySelector('figcaption') || element.querySelector('caption');
    if (!caption) {
      violations.push({
        code: 'TABLE_MISSING_CAPTION',
        message: 'Tables should have a caption or figcaption describing their content',
        element: 'table'
      });
    }
    
    // Check for thead
    const thead = element.querySelector('thead');
    if (!thead) {
      violations.push({
        code: 'TABLE_MISSING_THEAD',
        message: 'Tables should have a thead section for header cells',
        element: 'table'
      });
    }
    
    // Check for th elements in thead
    if (thead) {
      const headers = thead.querySelectorAll('th');
      if (headers.length === 0) {
        violations.push({
          code: 'TABLE_HEADERS_MISSING',
          message: 'Tables should have th elements in the thead for column/row headers',
          element: 'table'
        });
      }
      
      // Check for scope attribute on th elements
      headers.forEach((th, index) => {
        if (!th.hasAttribute('scope')) {
          violations.push({
            code: 'TABLE_HEADER_MISSING_SCOPE',
            message: `Header cell at index ${index} should have a scope attribute (col, row, colgroup, or rowgroup)`,
            element: 'th'
          });
        }
      });
    }
    
    // Check for tbody
    const tbody = element.querySelector('tbody');
    if (!tbody) {
      violations.push({
        code: 'TABLE_MISSING_TBODY',
        message: 'Tables should have a tbody section for data cells',
        element: 'table'
      });
    }
    
    // Check for properly associated headers and ids (complex tables)
    const allTh = element.querySelectorAll('th');
    allTh.forEach((th, index) => {
      const id = th.getAttribute('id');
      const headers = th.getAttribute('headers');
      
      // If a th has an id, some td should reference it via headers
      if (id && !headers) {
        const associatedCells = element.querySelectorAll(`[headers="${id}"]`);
        if (associatedCells.length === 0 && allTh.length > 1) {
          violations.push({
            code: 'TABLE_HEADER_NOT_ASSOCIATED',
            message: `Header with id "${id}" is not associated with any cells via headers attribute`,
            element: 'th'
          });
        }
      }
    });
    
    // Check for td/th count consistency (data cells should match header structure)
    if (tbody) {
      const rows = tbody.querySelectorAll('tr');
      let maxCols = 0;
      
      if (thead) {
        const headerCells = thead.querySelectorAll('th, td');
        maxCols = headerCells.length;
      }
      
      rows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll('td, th');
        if (maxCols > 0 && cells.length !== maxCols) {
          violations.push({
            code: 'TABLE_INCONSISTENT_COLUMNS',
            message: `Row ${rowIndex + 1} has ${cells.length} cells, but headers define ${maxCols} columns`,
            element: 'tr'
          });
        }
      });
    }
  }
  
  return violations;
}

/**
 * Parses the provided HTML string and runs accessibility checks on all table elements.
 * @param {string} html - The HTML content to analyze.
 * @returns {Promise<Array>} A promise that resolves to an array of violation objects found in tables.
 */
export async function checkTables(html) {
  const violations = [];
  
  if (!html || typeof html !== 'string') {
    return violations;
  }
  
  // Parse the HTML string
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  // Find all table elements
  const tables = doc.querySelectorAll('table');
  
  // Check each table for accessibility issues
  for (const table of tables) {
    const tableViolations = await checkAccessibility(table);
    
    // Add table reference to each violation
    tableViolations.forEach(violation => {
      violation.tableIndex = Array.from(tables).indexOf(table);
    });
    
    violations.push(...tableViolations);
  }
  
  return violations;
}

/**
 * Generates a human‑readable report based on the violations array.
 * @param {Array} violations - An array of violation objects.
 * @returns {string} The formatted report.
 */
export function generateReport(violations) {
  // This is a placeholder implementation that always returns an empty report.
  // TODO: Replace with actual report generation logic.
  return '';
}

/**
 * Entry point for the Node.js CLI.
 * Reads the input file, runs accessibility checks, and prints the report.
 */
export function run() {
  // TODO: Implement CLI logic
}

/**
 * Main application entry point
 *
 * Combines legacy table utilities with React-based accessibility enhancements.
 * - Legacy utilities (checkTableStructure, formatDate, sanitizeInput, createDataTable)
 *   remain available for non-React usage and for tests.
 * - Accessibility utilities are pulled in via the React app entry point.
 */

/**
 * Creates an in-page button element
 * @param {string} text - The text content of the button
 * @param {Object} options - Configuration options for the button
 * @param {Function} options.onClick - Click event handler function
 * @param {string} options.className - CSS class names for styling
 * @param {string} options.id - ID attribute for the button
 * @param {string} options.title - Tooltip text for the button
 * @param {boolean} options.disabled - Whether the button is disabled
 * @param {string} options.ariaLabel - Accessible label for the button
 * @param {string} options.ariaDescribedBy - ID of element describing the button
 * @returns {HTMLButtonElement} The created button element
 */
function createInPageButton(text, options = {}) {
    const button = document.createElement('button');
    button.textContent = text;
    
    if (options.className) {
        button.className = options.className;
    }
    
    if (options.id) {
        button.id = options.id;
    }
    
    if (options.title) {
        button.title = options.title;
    }
    
    if (typeof options.onClick === 'function') {
        ... options.onClick);
    }
    
    if (options.disabled) {
        button.disabled = true;
    }
    
    // REACT_036: Add accessible name to button (fixes fake link issue)
    if (options.ariaLabel) {
        button.setAttribute('aria-label', options.ariaLabel);
    }
    
    if (options.ariaDescribedBy) {
        button.setAttribute('aria-describedby', options.ariaDescribedBy);
    }
    
    return button;
}

const VERSION = '1.0.0';

// Configuration
const config = {
  apiUrl: process.env.API_URL || 'http://localhost:3000/api',
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
  const thead = ...
  const tbody = ...
  const tfoot = ...

  result.hasHeader = !!thead;
  result.hasBody = !!tbody;
  result.hasFooter = !!tfoot;

  // Get all rows
  const allRows = ...
  result.rowCount = allRows.length;

  if (result.rowCount === 0) {
    result.isValid = false;
    result.errors.push('Table has no rows');
    return result;
  }

  // Check header structure
  if (!result.hasHeader) {
    ... has no thead element');
  } else {
    const headerCells = ... td');
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
      result.errors.push(`Row ${index} has ${cells.length} cells, expected ...
    }
  });

  // REACT_027: Validate table accessibility - ensure proper th usage
  if (result.hasHeader) {
    const headerRow = thead.querySelector('tr');
    if (headerRow) {
      const headerCellsInFirstRow = headerRow.querySelectorAll('th');
      if (headerCellsInFirstRow.length === 0) {
        result.warnings.push('Table header row should contain th elements for proper accessibility');
      }
    }
  }

  return result;
}

/**
 * Validates table accessibility
 * @param {HTMLTableElement} table - The table element to validate
 * @returns {Object} - Validation result with accessibility issues
 */
function validateTableAccessibility(table) {
  const result = {
    issues: [],
    warnings: [],
    passed: true
  };

  if (!table) {
    result.passed = false;
    result.issues.push('Table element is required');
    return result;
  }

  // Check for caption
  const caption = table.querySelector('caption');
  if (!caption) {
    result.warnings.push('Table should have a caption for accessibility');
  }

  // Check for th elements in header
  const thead = table.querySelector('thead');
  if (thead) {
    const thElements = thead.querySelectorAll('th');
    if (thElements.length === 0) {
      result.issues.push('Table header should use th elements for proper accessibility');
      result.passed = false;
    }
  }

  // Check for scope attribute on th elements
  const allTh = table.querySelectorAll('th');
  allTh.forEach((th, index) => {
    if (!th.hasAttribute('scope')) {
      result.warnings.push(`th element ${index} should have a scope attribute`);
    }
  });

  return result;
}

/**
 * Validates table structure
 * @param {HTMLTableElement} table - The table element to validate
 * @returns {Object} - Structure validation result
 */
function validateTableStructure(table) {
  const result = {
    isValid: true,
    errors: [],
    warnings: []
  };

  if (!table) {
    result.isValid = false;
    result.errors.push('Table element is required');
    return result;
  }

  // Check for thead
  if (!table.querySelector('thead')) {
    result.warnings.push('Table should have a thead section');
  }

  // Check for tbody
  if (!table.querySelector('tbody')) {
    result.warnings.push('Table should have a tbody section');
  }

  // Check for proper th elements
  const thead = table.querySelector('thead');
  if (thead) {
    const headerRow = thead.querySelector('tr');
    if (headerRow) {
      const thElements = headerRow.querySelectorAll('th');
      if (thElements.length === 0) {
        result.errors.push('Table header row must contain th elements');
        result.isValid = false;
      }
    }
  }

  return result;
}

/**
 * Validates landmark structure
 * @param {Document|Element} root - The root element to validate
 * @returns {Object} - Validation result
 */
function validateLandmark(root) {
  const result = {
    issues: [],
    warnings: [],
    passed: true
  };

  const doc = root.ownerDocument || root;

  // Check for main landmark
  const mainElements = doc.querySelectorAll('main');
  if (mainElements.length === 0) {
    result.warnings.push('Document should have a main landmark');
    result.passed = false;
  } else if (mainElements.length > 1) {
    result.warnings.push('Document should have only one main landmark');
  }

  // Check for header landmark
  const headers = doc.querySelectorAll('header');
  if (headers.length === 0) {
    result.warnings.push('Document should have a header landmark');
  }

  // Check for footer landmark
  const footers = doc.querySelectorAll('footer');
  if (footers.length === 0) {
    result.warnings.push('Document should have a footer landmark');
  }

  // Check for nav landmark
  const navs = doc.querySelectorAll('nav');
  if (navs.length === 0) {
    result.warnings.push('Document should have at least one nav landmark');
  }

  return result;
}

/**
 * Validates landmark uniqueness
 * @param {Document|Element} root - The root element to validate
 * @returns {Object} - Validation result
 */
function validateLandmarkStructure(root) {
  const result = {
    issues: [],
    passed: true
  };

  const doc = root.ownerDocument || root;

  // Check for multiple main elements
  const mainElements =