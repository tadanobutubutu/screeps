// Existing code from main.js
// ...

// New changes to add the scope attribute to th elements
const updateTableHeaders = () => {
  const tableHeaders = document.querySelectorAll('th');
  tableHeaders.forEach(header => {
    if (!header.hasAttribute('scope')) {
      header.setAttribute('scope', 'col');
    }
  });
};

// Call the function to update headers when the document is loaded
document.addEventListener('DOMContentLoaded', updateTableHeaders);

// Continue with the rest of the existing code
// ...