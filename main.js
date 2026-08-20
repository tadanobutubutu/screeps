// [Your existing imports and code here]
// Make sure to preserve all existing code above this point

// Function to generate table headers with proper scope attributes
function generateTableHeaders() {
  return `
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Dependency</th>
        <th scope="col">Dependents</th>
        <th scope="col">Version</th>
        <th scope="col">Status</th>
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
      <td>${item.version}</td>
      <td>${item.status}</td>
    </tr>
  `).join('');
}

// Function to generate accessible SVG icons
function generateAccessibleIcon(iconName, ariaLabel) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-label="${ariaLabel}" role="img">
    <!-- Icon paths here -->
  </svg>`;
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
  generateTableHeaders,
  generateTableRows,
  generateAccessibleIcon,
  // Add any new functions you need to export
};