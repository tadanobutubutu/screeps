// Assuming the original main.js content is as follows:
// ... (other code)

// Original content from `docs/dependency-graph.html:186`
const originalContent = `
<a id="unrotate" href="#">rotate back</a>
`;

// Example of how to fix the table structure
const DependencyGraphTable = () => {
  return (
    <table>
      <thead>
        <tr>
          <th scope="col">File</th>
          <th scope="col">Dependencies</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">...</th>
          <td>...</td>
        </tr>
        <tr>
          <th scope="row">...</th>
          <td>...</td>
        </tr>
        {/* More rows with scope="row" for data headers */}
      </tbody>
    </table>
  );
};

// Updated content using a button
const updatedContent = `
<button id="unrotate" onclick="rotateBack()">rotate back</button>
`;

// Function to handle the rotation action
function rotateBack() {
  // Implementation of the rotate back action
  // ...
}

// Replace the original content with the updated content
// This is a hypothetical example, as the actual implementation would depend on the rest of the code
// For instance, you might need to call a function or update the state of a component
document.getElementById('unrotate').innerHTML = updatedContent;

// ... (other code)