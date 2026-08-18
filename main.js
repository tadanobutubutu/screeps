// Existing code from main.js (if any) goes here

// New function or changes requested in the issue
function updateTableHeaders() {
  const tableHeaders = document.querySelectorAll('th');
  tableHeaders.forEach(header => {
    if (!header.hasAttribute('scope')) {
      header.setAttribute('scope', 'col');
    }
  });
}

// Call the function to update headers when the document is loaded
document.addEventListener('DOMContentLoaded', updateTableHeaders);