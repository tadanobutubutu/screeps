// Assuming the table headers are inside a table with an ID 'myTable'
const tableHeaders = document.querySelectorAll('#myTable th');

tableHeaders.forEach(header => {
  // Check if the header already has a scope attribute
  if (!header.hasAttribute('scope')) {
    // Add the scope attribute with the value 'col'
    header.setAttribute('scope', 'col');
  }
});