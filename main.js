// main.js
// This file contains the main application logic for the Screeps dependency graph visualization

// Existing imports and code would be here
// ...

// Function to generate the dependency graph table
function generateDependencyGraph() {
  // Existing code would be here
  // ...

  // Create the table structure with proper scope attributes
  const table = document.createElement('table');
  table.className = 'table';

  // Create table header
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');

  // Add headers with proper scope attributes
  const headers = [
    { text: 'Source File', scope: 'col' },
    { text: 'Dependency', scope: 'col' },
    { text: 'Type', scope: 'col' },
    { text: 'Line', scope: 'col' }
  ];

  headers.forEach(header => {
    const th = document.createElement('th');
    th.scope = header.scope;
    th.innerHTML = `<div>${header.text}</div>`;
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Existing code to populate table body would be here
  // ...

  return table;
}

// Other existing functions and exports would be here
// ...

// Example of how the table might be used
function renderDependencyGraph(data) {
  const container = document.getElementById('dependency-graph-container');
  if (container) {
    const table = generateDependencyGraph(data);
    container.innerHTML = '';
    container.appendChild(table);
  }
}

// Export any necessary functions
// module.exports = { ... };