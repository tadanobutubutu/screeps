// [Your existing main.js content here]
// ... (all your current code remains unchanged)

// Add the following function to handle the table header scope attributes
function updateTableHeaders() {
  // This function would be called after the DOM is loaded
  // to add scope attributes to table headers
  const headers = document.querySelectorAll('th');
  headers.forEach(header => {
    if (header && !header.hasAttribute('scope')) {
      // Default to 'col' scope for most headers
      header.setAttribute('scope', 'col');
      // Special cases for row headers if needed
      // Check if this is a row header (first cell in each row)
      const cellIndex = header.cellIndex;
      const row = header.parentElement;
      if (row && row.rowIndex > 0 && cellIndex === 0) {
        header.setAttribute('scope', 'row');
      }
    }
  });
}

// Call the function when the DOM is fully loaded
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateTableHeaders);
  } else {
    updateTableHeaders();
  }
}

// [Rest of your existing main.js content here]
// ... (all your current code remains unchanged)