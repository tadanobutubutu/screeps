/**
 * Main JavaScript file for accessibility fixes
 * Addresses REACT_027 - React Table Structure warning
 */

// Utility function to add scope attribute to table header cells
function addScopeToTableHeaders(table) {
  if (!table || table.tagName !== 'TABLE') {
    return table;
  }

  const rows = table.querySelectorAll('tr');
  const firstRow = rows[0];
  
  if (!firstRow) {
    return table;
  }

  const headerCells = firstRow.querySelectorAll('th');
  headerCells.forEach((cell) => {
    if (!cell.hasAttribute('scope')) {
      cell.setAttribute('scope', 'col');
    }
  });

  // Process other rows for row headers (first th in each row)
  rows.forEach((row, index) => {
    if (index === 0) return; // Skip first row as it's handled above
    
    const firstCell = row.querySelector('th');
    if (firstCell && !firstCell.hasAttribute('scope')) {
      firstCell.setAttribute('scope', 'row');
    }
  });

  return table;
}

// Process all tables in a document or element
function processTables(rootElement = document) {
  const tables = rootElement.querySelectorAll('table');
  tables.forEach((table) => {
    addScopeToTableHeaders(table);
  });
  return tables.length;
}

// Export for testing
module.exports = {
  addScopeToTableHeaders,
  processTables,
};