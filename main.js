// [Your existing imports and code here]
// Make sure to preserve all existing code above this point

// Function to generate table headers with proper scope attributes
function generateTableHeaders() {
  return `
    <thead>
      <tr>
        <th scope="col"><div>src/constants.js</div></th>
        <th scope="col"><div>src/managers/roomManager.js</div></th>
        <th scope="col"><div>src/managers/spawnManager.js</div></th>
        <th scope="col"><div>src/managers/towerManager.js</div></th>
        <th scope="col"><div>src/roles/builder.js</div></th>
        <!-- Add other headers with scope="col" as needed -->
      </tr>
    </thead>
  `;
}

// Function to generate table rows with proper scope attributes
function generateTableRows(data) {
  return data.map((item, index) => `
    <tr>
      <td scope="row">${index + 1}</td>
      <td>${item.dependency}</td>
      <td>${item.dependents}</td>
    </tr>
  `).join('');
}

// [Your existing exports and functions here]
// Make sure to preserve all existing exports below this point

// Example of how you might use these functions in your existing code:
function generateDependencyGraph(data) {
  return `
    <table>
      ${generateTableHeaders()}
      <tbody>
        ${generateTableRows(data)}
      </tbody>
    </table>
  `;
}

// Export all your existing functions
module.exports = {
  // Your existing exports here
  generateDependencyGraph,
  // Add any new functions you need to export
};