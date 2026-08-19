// main.js
// This file contains the main application logic and exports

// Existing exports (preserved)
export const existingFunction = () => {
  // ... existing code ...
};

// New function to handle table headers with proper scope attributes
export const createTableHeader = (text, scope = 'col') => {
  return `<th scope="${scope}"><div>${text}</div></th>`;
};

// Function to generate the dependency graph table with proper headers
export const generateDependencyGraph = () => {
  // Example implementation - adjust according to your actual needs
  const headers = [
    'src/constants.js',
    'src/managers/roomManager.js',
    'src/managers/spawnManager.js',
    'src/managers/towerManager.js',
    'src/roles/builder.js'
    // Add other headers as needed
  ];

  let tableHTML = '<table><thead><tr>';

  // Add headers with proper scope
  headers.forEach(header => {
    tableHTML += createTableHeader(header);
  });

  tableHTML += '</tr></thead><tbody>';

  // Add table body content here
  // ...

  tableHTML += '</tbody></table>';

  return tableHTML;
};

// Other existing functions (preserved)
// ...