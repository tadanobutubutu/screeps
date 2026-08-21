primaryContent = ` 
  <main id="main-content" role="main" lang="en">
    ...
  </main>
`;

// Replace the <a> element with a <button> element for the 'rotate back' action
rotateBackButton = ` 
  <button id="unrotate" class="rotate-back-button" aria-label="Rotate back">
    rotate back
  </button>
`;

// Ensure that the button has the appropriate event listener if needed
document.getElementById('unrotate').addEventListener('click', function () {
  // Call the rotate back functionality
  rotateBack();
});

// Add lang attribute for HTML element
document.documentElement.lang = "en";

// Add scope="col" to all <th> elements for accessibility
const tableHeaders = document.querySelectorAll('table th');
tableHeaders.forEach(th => {
  th.setAttribute('scope', 'col');
});

// ... [rest of accessibility code from HEAD] ...

// Function to render table dynamically
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

// ... [rest of existing code from HEAD, including rotateBack function and exports] ...