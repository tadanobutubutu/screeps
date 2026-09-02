// main.js - Accessibility-focused implementation

/**
 * Main application entry point
 */

// Helper function for table cell validation
function validateTableCell(cell) {
  const validTags = ['th', 'td'];
  const hasThParent = cell.tagName.toLowerCase() === 'th';
  return hasThParent || validTags.includes(cell.tagName.toLowerCase());
}

/**
 * Validates table accessibility structure
 * @param {HTMLTableElement} table - The table element to validate
 * @returns {Array} Array of accessibility issues found
 */
function validateTableStructure(table) {
  const issues = [];
  
  // Check for table header
  const headers = table.querySelectorAll('thead');
  if (headers.length === 0) {
    issues.push('Table missing <thead> element');
  }
  
  // Check for table body
  const bodies = table.querySelectorAll('tbody');
  if (bodies.length === 0) {
    issues.push('Table missing <tbody> element');
  }
  
  // Check for header cells in first row
  const rows = table.querySelectorAll('tr');
  if (rows.length > 0) {
    const firstRowCells = rows[0].querySelectorAll('th, td');
    let hasHeader = false;
    firstRowCells.forEach(cell => {
      if (cell.tagName.toLowerCase() === 'th') {
        hasHeader = true;
      }
    });
    if (!hasHeader && firstRowCells.length > 0) {
      issues.push('First row should contain header cells (<th>)');
    }
  }
  
  return issues;
}

/**
 * Validates table accessibility attributes
 * @param {HTMLTableElement} table - The table element to validate
 * @returns {Array} Array of accessibility issues found
 */
function validateTableAccessibility(table) {
  const issues = [];
  
  // Check for summary or caption
  const caption = table.querySelector('caption');
  const summary = table.getAttribute('summary');
  
  if (!caption && !summary) {
    issues.push('Table missing caption or summary attribute');
  }
  
  // Check for scope attributes on header cells
  const headerCells = table.querySelectorAll('th');
  headerCells.forEach((cell, index) => {
    if (!cell.hasAttribute('scope')) {
      issues.push(`Header cell ${index + 1} missing scope attribute`);
    }
  });
  
  return issues;
}

const checkTableStructure = {
  validate: validateTableStructure,
  checkAccessibility: validateTableAccessibility
};

// Get language attribute based on page content
function getFullLangAttribute() {
  if (typeof document !== 'undefined' && document.documentElement) {
    return document.documentElement.lang || (typeof navigator !== 'undefined' ? navigator.language : undefined) || 'en-US';
  }
  return 'en-US';
}

/**
 * Gets the person name to use in lang attribute
 * @returns {string} The language code
 */
function personName() {
  // ... code for handling person name
  return 'User';
}

// Add lang attribute to HTML element
function addLangAttribute() {
  const htmlElement = document.documentElement;
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    const lang = getFullLangAttribute();
    htmlElement.setAttribute('lang', lang);
  }
}

// Add accessible names to SVG elements
function getSvgAccessibleName(svg) {
  // Check for title element
  const title = svg.querySelector('title');
  if (title && title.textContent.trim()) {
    return title.textContent.trim();
  }
  
  // Check for aria-label already set
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  
  // Check for parent element with accessible name
  const parent = svg.parentElement;
  if (parent) {
    const parentLabel = parent.getAttribute('aria-label') || 
                        parent.getAttribute('alt') ||
                        parent.querySelector('img')?.getAttribute('alt');
    if (parentLabel) {
      return parentLabel;
    }
  }
  
  return null;
}