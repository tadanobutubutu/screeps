// Assuming the HTML content is being dynamically inserted into the DOM or rendered by React

// Example of a function that might render the table
function renderTable() {
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');
  const headerRow = document.createElement('tr');

  // Assuming you have an array of headers
  const headers = ['Header 1', 'Header 2', 'Header 3'];

  headers.forEach(headerText => {
    const th = document.createElement('th');
    th.setAttribute('scope', 'col'); // Adding the scope attribute
    th.textContent = headerText;
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);
  table.appendChild(tbody);

  // Append the table to the document body or another element
  document.body.appendChild(table);
}

// Call the function to render the table
renderTable();