// Example of a hypothetical main.js file that dynamically generates HTML

// Function to generate a table row with a header cell
function generateTableHeaderCell(content) {
  return `<th scope="col">${content}</th>`;
}

// Function to generate a table row with data cells
function generateTableRow(data) {
  return `<tr>${data.map(item => `<td>${item}</td>`).join('')}</tr>`;
}

// Example usage
const headers = ['Header 1', 'Header 2', 'Header 3'];
const rows = [
  ['Data 1-1', 'Data 1-2', 'Data 1-3'],
  ['Data 2-1', 'Data 2-2', 'Data 2-3'],
  // ... more rows
];

const tableHTML = `<table>${headers.map(header => generateTableHeaderCell(header)).join('')}</table>`;
const tableBodyHTML = `<tbody>${rows.map(row => generateTableRow(row)).join('')}</tbody>`;

// Assuming you have a function to inject HTML into the DOM
injectHTMLIntoDOM(tableHTML, 'table-container');
injectHTMLIntoDOM(tableBodyHTML, 'table-body-container');