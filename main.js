// [Your existing imports and code here]
// Make sure to preserve all existing code above this point

// Function to generate table headers with proper scope attributes
function generateTableHeaders() {
  return `
    <thead>
      <tr>
        <th ...
        <th ...
        <th ...
        <th ...
        <th ...
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
<main>
    <table>
      ${generateTableHeaders()}
      <tbody>
        ...
      </tbody>
    </table>
    </main>
  `;
}

// Export all your existing functions
module.exports = {
  // Your existing exports here
  generateDependencyGraph,
  // Add any new functions you need to export
};