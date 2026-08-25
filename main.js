// Import the indexContent from src/index.js
import { indexContent } from './src/index';

// Import the dependencyGraphContent from src/dependencyGraph.js
import { dependencyGraphContent } from './src/dependencyGraph';

// ... (Existing imports and functions)

// Add a new function to render dependency graph content or index view, as needed
function renderContent(contentType) {
  switch (contentType) {
    case 'dependency-graph':
      // Render dependency graph content using the imported dependencyGraphContent
      function renderDependencyGraphContent() {
        // Replace the existing content within the dependencyGraph div using the dependencyGraphContent.
        const container = document.getElementById('dependencyGraph');
        if (container) {
          container.innerHTML = dependencyGraphContent;
        }
      }
      // Call the updated renderDependencyGraphContent function
      renderDependencyGraphContent();
      break;
    case 'index':
      // Render index content
      function renderIndexContent() {
        // Get the container for index content
        const container = document.getElementById('index');
        // Update the container with the indexContent from index.js
        if (container) {
          container.innerHTML = indexContent;
        }
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