// Existing code from main.js (before conflict markers)
// ...

// Add the new function or changes requested in the issue
function fixTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    const headers = table.querySelectorAll('th');
    headers.forEach(header => {
      if (!header.hasAttribute('scope')) {
        header.setAttribute('scope', 'col');
      }
    });
  });
}

// Call the function to apply the fix
fixTableStructure();

// Existing code from main.js (after conflict markers)
// ...