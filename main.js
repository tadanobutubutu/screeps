// main.js
// [Your existing code remains unchanged]

// Add this new function to handle table header scope attributes
function updateTableHeaders() {
  const tableHeaders = document.querySelectorAll('th');

  tableHeaders.forEach(header => {
    // Only add scope if it doesn't already exist
    if (!header.hasAttribute('scope')) {
      // Determine if this is a column or row header based on context
      if (header.closest('thead') || header.closest('tr:first-child')) {
        header.setAttribute('scope', 'col');
      } else if (header.closest('tbody') || header.closest('tr') && !header.closest('tr:first-child')) {
        header.setAttribute('scope', 'row');
      }
    }
  });
}

// Call the function when the DOM is loaded
document.addEventListener('DOMContentLoaded', updateTableHeaders);

// [Your existing exports remain unchanged]