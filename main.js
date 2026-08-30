// Main application logic
function init() {
  console.log('Application initialized');
}

// TODO: Validate the table structure for accessibility issues

/**
 * Validates table structure for accessibility issues
 * @param {HTMLTableElement} tableElement - The table element to validate
 * @returns {Object} - Validation result with isValid boolean and issues array
 */
function validateTableAccessibility(tableElement) {
  const issues = [];
  
  if (!tableElement || tableElement.tagName !== 'TABLE') {
    return {
      isValid: false,
      issues: ['Invalid table element provided']
    };
  }
  
  // Check if table has a caption for context
  const caption = tableElement.querySelector('caption');
  if (!caption) {
    issues.push('Table should have a caption element to describe its purpose');
  }
  
  // Check if table has header cells (th)
  const headers = tableElement.querySelector('thead th, thead td');
  if (!headers || headers.length === 0) {
    issues.push('Table should have header cells in thead for accessibility');
  }
  
  // Validate header cells have scope attributes
  const thElements = tableElement.querySelectorAll('th');
  thElements.forEach((th, index) => {
    if (!th.hasAttribute('scope')) {
      issues.push(`Header cell at index ${index} should have a scope attribute (col, row, colgroup, or rowgroup)`);
    }
  });
  
  // Check for empty header cells
  thElements.forEach((th, index) => {
    if (!th.textContent || th.textContent.trim() === '') {
      issues.push(`Header cell at index ${index} should not be empty`);
    }
  });
  
  // Check if table has proper structure (thead and tbody)
  const thead = tableElement.querySelector('thead');
  if (!thead) {
    issues.push('Table should use thead element for header rows');
  }
  
  const tbody = tableElement.querySelector('tbody');
  if (!tbody) {
    issues.push('Table should use tbody element for data rows');
  }
  
  // Check for proper header-description relationships
  const dataCells = tableElement.querySelectorAll('td');
  dataCells.forEach((td, index) => {
    if (!td.hasAttribute('headers') && thElements.length > 0) {
      // Only suggest headers attribute if there are multiple headers
      // and the cell might need explicit association
    }
  });
  
  // Check for complex tables needing id/headers association
  const rowHeaders = tableElement.querySelectorAll('tbody th');
  if (rowHeaders.length > 0) {
    rowHeaders.forEach((th, index) => {
      if (!th.id) {
        issues.push(`Row header at index ${index} should have an id attribute for association with data cells`);
      }
    });
  }
  
  return {
    isValid: issues.length === 0,
    issues: issues
  };
}

/**
 * Validates accessibility for all tables in a document or container
 * @param {Document|HTMLElement} container - Document or container element to search
 * @returns {Object} - Summary of all validation results
 */
function validateAllTablesAccessibility(container) {
  const tables = container.querySelectorAll('table');
  const results = {
    totalTables: tables.length,
    accessibleTables: 0,
    tablesWithIssues: 0,
    allIssues: []
  };
  
  tables.forEach((table, index) => {
    const validation = validateTableAccessibility(table);
    if (validation.isValid) {
      results.accessibleTables++;
    } else {
      results.tablesWithIssues++;
      results.allIssues.push({
        tableIndex: index,
        issues: validation.issues
      });
    }
  });
  
  return results;
}

// Export functions for testing and external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    validateTableAccessibility,
    validateAllTablesAccessibility,
    init
  };
}