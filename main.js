// Example of how to fix the issue in main.js
document.addEventListener('DOMContentLoaded', () => {
  // Assuming there is a table with id 'myTable'
  const table = document.getElementById('myTable');

  // Iterate over all <th> elements and add the scope attribute
  const headers = table.querySelectorAll('th');
  headers.forEach(header => {
    if (!header.hasAttribute('scope')) {
      header.setAttribute('scope', 'col');
    }
  });

  // ... rest of your code ...
});