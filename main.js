// Preserve all existing code from main.js
// ... (all your existing code remains unchanged) ...

// Add the new function to generate table headers with proper scope
function generateTableHeader(text, scope = 'col') {
  return `<th scope="${scope}"><div>${text}</div></th>`;
}

// Example usage in your table generation code:
const tableHeaders = [
  generateTableHeader('src/constants.js'),
  generateTableHeader('src/managers/roomManager.js'),
  generateTableHeader('src/managers/spawnManager.js'),
  generateTableHeader('src/managers/towerManager.js'),
  generateTableHeader('src/roles/builder.js')
  // Add other headers as needed
];

// Then use these headers in your table rendering