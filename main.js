// [Your existing imports and code here]
// Make sure to preserve all existing code above this point

// Function to generate table headers with proper scope attributes and ARIA labels
function generateTableHeaders() {
  return `
    <thead>
      <tr>
        <th scope="col" aria-label="File path"><div>src/constants.js</div></th>
        <th scope="col" aria-label="File path"><div>src/managers/roomManager.js</div></th>
        <th scope="col" aria-label="File path"><div>src/managers/spawnManager.js</div></th>
        <th scope="col" aria-label="File path"><div>src/managers/towerManager.js</div></th>
        <th scope="col" aria-label="File path"><div>src/roles/builder.js</div></th>
        <!-- Add other headers with scope="col" as needed -->
      </tr>
    </thead>
  `;
}

// Function to generate table rows with proper scope attributes and ARIA labels
function generateTableRows(data) {
  return data.map((item, index) => `
    <tr>
      <td scope="row" aria-label="Row ${index + 1}">${index + 1}</td>
      <td aria-label="Dependency">${item.dependency}</td>
      <td aria-label="Dependents">${item.dependents}</td>
    </tr>
  `).join('');
}

// Function to generate a table with proper ARIA attributes
function generateAccessibleTable(data) {
  return `
    <table role="grid" aria-label="Dependency graph">
      ${generateTableHeaders()}
      <tbody role="rowgroup">
        ${generateTableRows(data)}
      </tbody>
    </table>
  `;
}

// [Your existing exports and functions here]
// Make sure to preserve all existing exports below this point

// Example of how you might use these functions in your existing code:
function generateDependencyGraph(data) {
  return generateAccessibleTable(data);
}

// Export all your existing functions
module.exports = {
  // Your existing exports here
  generateDependencyGraph,
  // Add any new functions you need to export
};