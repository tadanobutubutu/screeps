// Example of how to update a table within main.js
const table = document.querySelector('table'); // Select the table element
if (table) {
  const thead = table.querySelector('thead'); // Select the table header
  if (thead) {
    const headers = thead.querySelectorAll('th'); // Select all header cells
    headers.forEach(header => {
      // Check if the header already has a scope attribute
      if (!header.hasAttribute('scope')) {
        // Add the scope attribute with the value 'col' or 'row'
        header.setAttribute('scope', 'col'); // Use 'row' if it's a row header
      }
    });
  }
}