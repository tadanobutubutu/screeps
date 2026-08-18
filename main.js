// Existing code and exports from main.js
// ...

// New function or changes requested in the issue
function fixTableStructure() {
  const tableElements = document.querySelectorAll('th[scope]');
  tableElements.forEach((th) => {
    th.setAttribute('scope', 'col');
  });
}

// Call the function to fix the table structure
fixTableStructure();

// Existing code and exports from main.js
// ...