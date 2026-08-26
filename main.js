// Current main.js - No existing code to preserve
// This file appears to be empty or contains no relevant code

// Function to validate and add scope attributes to table headers
function ensureTableHeaderScope(thElement, type = 'col') {
  if (!thElement) return false;
  
  const validScopes = ['col', 'row', 'colgroup', 'rowgroup'];
  const scope = thElement.getAttribute('scope');
  
  if (scope && validScopes.includes(scope)) {
    return true;
  }
  
  // Add default scope if missing or invalid
  thElement.setAttribute('scope', type);
  return true;
}

// Function to fix all table headers in a container
function fixTableHeaders(container) {
  const tables = container ? container.querySelectorAll('table') : document.querySelectorAll('table');
  
  tables.forEach(table => {
    // Fix column headers (first row)
    const firstRow = table.querySelector('thead tr') || table.rows[0];
    if (firstRow) {
      firstRow.querySelectorAll('th').forEach(th => {
        ensureTableHeaderScope(th, 'col');
      });
    }
    
    // Fix row headers (first cell in each row)
    table.querySelectorAll('tbody tr, thead tr').forEach(row => {
      const firstCell = row.querySelector('th');
      if (firstCell) {
        ensureTableHeaderScope(firstCell, 'row');
      }
    });
  });
}

module.exports = {
  ensureTableHeaderScope,
  fixTableHeaders
};