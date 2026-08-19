// Assuming this is your main.js content

// ... (existing code)

// Update the problematic th elements in the dependency-graph table
const tableRows = document.querySelectorAll('table tbody tr');
tableRows.forEach((row) => {
  const cells = row.querySelectorAll('th, td');
  // Update the header cell with scope attribute
  cells[1].setAttribute('scope', 'col');
});

// ... (other existing code)