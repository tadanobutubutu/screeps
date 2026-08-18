// main.js
// [Your existing code remains unchanged]

// Add this new function to handle table header scope attributes
function updateTableHeaderScopes() {
  // Select all table headers that need scope attributes
  const headers = document.querySelectorAll('th:not([scope])');

  headers.forEach(header => {
    // Determine if this is a column or row header based on context
    const isColumnHeader = header.closest('thead') !== null ||
                          header.parentElement.querySelectorAll('th').length > 1;

    // Set appropriate scope attribute
    header.setAttribute('scope', isColumnHeader ? 'col' : 'row');
  });
}

// Call the function when the DOM is loaded
document.addEventListener('DOMContentLoaded', updateTableHeaderScopes);

// [Rest of your existing code remains unchanged]