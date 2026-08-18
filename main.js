// Original main.js content
// (Assuming this is the content of main.js with conflict markers removed)

// ... [existing code] ...

// New changes requested in the issue
const addScopeToTableHeaders = () => {
  const tableHeaders = document.querySelectorAll('th');
  tableHeaders.forEach(header => {
    if (!header.hasAttribute('scope')) {
      header.setAttribute('scope', 'col');
    }
  });
};

// ... [existing code] ...

// Ensure the new function is called when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', addScopeToTableHeaders);

// ... [existing code] ...