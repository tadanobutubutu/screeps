// Assuming you have an array of header labels
const tableHeaders = [
  { label: 'src/constants.js' },
  { label: 'src/managers/roomManager.js' },
  // ... more headers
];

// Function to generate a table with proper scope attributes
function generateAccessibleTable(headers) {
  const table = document.createElement('table');
  table.setAttribute('role', 'grid');
  
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  
  headers.forEach((header, index) => {
    const th = document.createElement('th');
    th.setAttribute('scope', 'col');
    th.innerHTML = `<div>${header.label}</div>`;
    headerRow.appendChild(th);
  });
  
  thead.appendChild(headerRow);
  table.appendChild(thead);
  
  return table;
}

// Example usage
document.getElementById('myTable').appendChild(generateAccessibleTable(tableHeaders));