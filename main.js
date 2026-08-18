// main.js
// [Your existing code remains unchanged]

// Add this new function to handle table header scope attributes
function ensureTableHeaderScopes() {
  // This function will be called during initialization to ensure all table headers have proper scope attributes
  const tables = document.querySelectorAll('table');

  tables.forEach(table => {
    const headers = table.querySelectorAll('th');

    headers.forEach(header => {
      // Only add scope if it doesn't already exist
      if (!header.hasAttribute('scope')) {
        // Determine if this is a column or row header based on its position
        const rowIndex = header.parentElement.rowIndex;
        const cellIndex = header.cellIndex;

        // For the first row, assume column headers
        if (rowIndex === 0) {
          header.setAttribute('scope', 'col');
        }
        // For the first column, assume row headers
        else if (cellIndex === 0) {
          header.setAttribute('scope', 'row');
        }
        // For other headers, default to column scope
        else {
          header.setAttribute('scope', 'col');
        }
      }
    });
  });
}

// Call the function when the DOM is loaded
document.addEventListener('DOMContentLoaded', ensureTableHeaderScopes);

// [Rest of your existing code remains unchanged]