// Existing code and exports from current main.js
// ...

// New functions or changes requested in the issue
function updateTableStructure() {
  const tableElements = document.querySelectorAll('th');
  tableElements.forEach((th) => {
    if (!th.hasAttribute('scope')) {
      th.setAttribute('scope', 'col');
    }
  });
}

// Call the function to update the table structure
updateTableStructure();

// Existing code and exports from current main.js
// ...