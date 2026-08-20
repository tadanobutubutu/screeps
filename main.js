// [Your existing code above this point remains unchanged]

// Add this new function to handle table header scope attributes
function addTableHeaderScopes() {
  // Select all th elements in your table
  const headers = document.querySelectorAll('th');

  headers.forEach((header) => {
    // Check if the header already has a scope attribute
    if (!header.hasAttribute('scope')) {
      // Determine if this is a column or row header based on position
      // Check if this is a row header by looking at parent structure
      const parentRow = header.parentElement;
      const isFirstCell = parentRow ? parentRow.querySelector('th') === header : false;
      
      if (isFirstCell) {
        header.setAttribute('scope', 'row');
      } else {
        header.setAttribute('scope', 'col');
      }
    }
  });
}

// Call this function when your table is rendered
document.addEventListener('DOMContentLoaded', addTableHeaderScopes);

// [Your existing code below this point remains unchanged]