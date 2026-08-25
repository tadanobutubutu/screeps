// Import the indexContent from src/index.js
import { indexContent } from './src/index';

// ... (Existing imports and functions)

// Add a new function to render dependency graph content or index view, as needed
function renderContent(contentType) {
  switch (contentType) {
    case 'dependency-graph':
      // Render dependency graph content
      function renderDependencyGraphContent(data) {
        // Replace the existing content within the dependencyGraph div using the provided data.
        const container = document.getElementById('dependency-graph');
        if (container) {
          container.innerHTML = data;
        }
      }
      // Call the updated renderDependencyGraphContent function
      renderDependencyGraphContent(/* data or function that generates data */);
      break;
    case 'index':
      // Render index content
      function renderIndexContent() {
        // Get the container for index content
        const container = document.getElementById('index-container');
        // Update the container with the indexContent from index.js
        container.innerHTML = indexContent;
      }
      // Call the renderIndexContent function
      renderIndexContent();
      break;
    // Add more cases as needed for other types of content
    default:
      throw new Error(`Unsupported content type: ${contentType}`);
  }
}

// Update the existing `renderGraphContent` function to call `renderContent` function instead
if (dependencyGraph) {
  renderContent('dependency-graph'); // or call with data that generates the dependency graph
}

// Export renderContent function for better maintainability
module.exports = {
  ... // Existing exports
  renderContent // Add renderContent to the list of exports
};