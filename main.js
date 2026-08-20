// Assuming you have a function that renders the table headers
function renderTableHeaders(headers) {
  return headers.map((header, index) => {
    // Ensure each header has a scope attribute
    return `<th scope="col">${header}</th>`;
  }).join('');
}

// Example usage
const headers = ['Column 1', 'Column 2', 'Column 3'];
const tableHeadersHTML = renderTableHeaders(headers);

// You would then insert this HTML into your document or component
document.getElementById('table-headers').innerHTML = tableHeadersHTML;