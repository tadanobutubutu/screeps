// Preserve existing code and exports from main.js

// Add the new code to fix the React Table Structure issue
var updatedDependencyGraphHtml = `
// Existing HTML content from docs/dependency-graph.html

<thead>
  <tr>
    <th scope="col"><div>src/constants.js</div></th>
    <!-- Other cells with scope attribute -->
  </tr>
  <!-- Other rows with scope attribute -->
</thead>

// Existing HTML content after the table
`;

// Export the updated HTML content
module.exports = {
  dependencyGraphHtml: updatedDependencyGraphHtml
};