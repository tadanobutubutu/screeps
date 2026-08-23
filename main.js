// Hypothetical function in main.js that generates table headers
function generateTableHeaders() {
  const headers = [
    { name: 'src/constants.js', type: 'Constant' },
    { name: 'src/managers/roomManager.js', type: 'Manager' },
    // ... other headers
  ];

  return headers.map(header => {
    return `<th scope="col">${header.name}</th>`;
  }).join('');
}

// This function would then be used to create the table headers in the HTML
// For example, when rendering the table on a page
document.getElementById('table-headers').innerHTML = generateTableHeaders();