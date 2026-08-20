// main.js
// Preserve all existing code and exports
// Only add the new scope attributes to the table headers

// This function adds scope attributes to table headers in the dependency graph
function enhanceDependencyGraphTable() {
  // Get the dependency graph table
  const table = document.querySelector('#dependency-graph-table');

  if (table) {
    // Add scope attributes to all th elements in the table
    const headers = table.querySelectorAll('th');
    headers.forEach(header => {
      if (!header.hasAttribute('scope')) {
        // Determine if this is a row or column header based on its position
        const rowIndex = header.parentElement.rowIndex;
        const cellIndex = header.cellIndex;

        // Column headers typically appear in the first row
        if (rowIndex === 0) {
          header.setAttribute('scope', 'col');
        } else {
          // Row headers typically appear in the first column
          if (cellIndex === 0) {
            header.setAttribute('scope', 'row');
          }
        }
      }
    });
  }
}

// Call the function when the DOM is loaded
document.addEventListener('DOMContentLoaded', enhanceDependencyGraphTable);

// Preserve all existing exports and functions
// ... (rest of your existing code remains unchanged)