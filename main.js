// Assuming `main.js` contains some dynamically generated HTML, here's a generic way to update the `<th>` elements:
const tableElements = document.querySelectorAll('table'); // Select all table elements in the document

tableElements.forEach(table => {
  const headerCells = table.querySelectorAll('th');
  headerCells.forEach(th => {
    if (!th.hasAttribute('scope')) {
      // If the scope attribute is missing, add it with a value of 'col' or 'row' as needed
      th.setAttribute('scope', 'col'); // Use 'row' if the header is for a row rather than a column
    }
  });
});