// Main.js - Table accessibility fix for REACT_027
// Adds scope attributes to table header cells

/**
 * Adds scope attribute to table header cells
 * @param {HTMLTableElement} table - The table element to process
 * @returns {number} - Number of header cells updated
 */
function addScopeToHeaders(table) {
  let count = 0;
  const thead = table.querySelector('thead');
  
  if (!thead) return count;
  
  const headerRows = thead.querySelectorAll('tr');
  headerRows.forEach((row, rowIndex) => {
    const ths = row.querySelectorAll('th');
    ths.forEach(th => {
      if (!th.hasAttribute('scope')) {
        // If it's the first row, use col; otherwise row
        const scope = rowIndex === 0 ? 'col' : 'row';
        th.setAttribute('scope', scope);
        count++;
      }
    });
  });
  
  return count;
}

/**
 * Processes all tables in a container and adds scope attributes
 * @param {HTMLElement} container - Container element to search within
 * @returns {Object} - Summary of updates
 */
function processTableAccessibility(container = document) {
  const tables = container.querySelectorAll('table');
  const results = {
    tablesProcessed: 0,
    headersUpdated: 0
  };
  
  tables.forEach(table => {
    const updated = addScopeToHeaders(table);
    if (updated > 0) {
      results.tablesProcessed++;
      results.headersUpdated += updated;
    }
  });
  
  return results;
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { addScopeToHeaders, processTableAccessibility };
}