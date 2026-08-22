// Hypothetical example of a function in main.js that generates table headers
function generateTableHeaders(headers) {
  return headers.map((header, index) => {
    // Assuming each header is an object with a text property
    return `<th scope="col">${header.text}</th>`;
  }).join('');
}

// Usage of the function, which would be called when needed to generate the table headers
const tableHeaders = [
  { text: 'Header 1' },
  { text: 'Header 2' },
  // ... more headers
];

const tableHeaderHTML = generateTableHeaders(tableHeaders);
// This would then be inserted into the HTML where the table headers are needed