// Add scope attribute to table header cells based on their position

function addScopeToTableHeaders(tableElement) {
  if (!tableElement) return;
  
  const rows = tableElement.querySelectorAll('tr');
  
  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('th, td');
    
    cells.forEach((cell, cellIndex) => {
      if (cell.tagName === 'TH') {
        // First column (row headers) - scope="row"
        if (cellIndex === 0) {
          cell.setAttribute('scope', 'row');
        } 
        // First row (column headers) - scope="col"
        else if (rowIndex === 0) {
          cell.setAttribute('scope', 'col');
        }
      }
    });
  });
}

// Utility function to validate scope attributes exist
function validateTableAccessibility(tableElement) {
  const headers = tableElement.querySelectorAll('th');
  const invalidHeaders = [];
  
  headers.forEach((header, index) => {
    if (!header.hasAttribute('scope')) {
      invalidHeaders.push({
        element: header,
        position: index,
        message: 'Header cell lacks scope attribute'
      });
    }
  });
  
  return {
    valid: invalidHeaders.length === 0,
    issues: invalidHeaders
  };
}

// Apply fixes to all tables in document
function fixAllTables() {
  const tables = document.querySelectorAll('table');
  
  tables.forEach(table => {
    addScopeToTableHeaders(table);
  });
  
  return tables.length;
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    addScopeToTableHeaders,
    validateTableAccessibility,
    fixAllTables
  };
}