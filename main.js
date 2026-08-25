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
        const container = document.getElementById('indexContent');
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

// TODO: Implement ...
function addProperLandmarkRegions() {
  // Ensure the document has proper landmark regions for accessibility.
  // This includes <header>, <nav>, <main>, and <footer> elements
  // wrapping the corresponding sections of the page.

  // REACT_015: Ensure the html element has a lang attribute for accessibility
  const html = document.documentElement;
  if (!html.hasAttribute('lang')) {
    html.setAttribute('lang', 'en');
  }

  // Ensure a <header> landmark exists at the top of the body
  let header = document.querySelector('header');
  if (!header) {
    header = document.createElement('header');
    document.body.prepend(header);
  }

  // Ensure a <nav> landmark exists for navigation
  let nav = document.querySelector('nav');
  if (!nav) {
    nav = document.createElement('nav');
    header.appendChild(nav);
  }

  // Ensure a <main> landmark exists for primary content
  let main = document.querySelector('main');
  if (!main) {
    main = document.createElement('main');
    // Move existing body children (except header/footer) into <main>
    const children = Array.from(document.body.children);
    children.forEach((child) => {
      if (child !== header && child.tagName !== 'FOOTER' && child.tagName !== 'NAV') {
        main.appendChild(child);
      }
    });
    document.body.appendChild(main);
  }

  // Ensure a <footer> landmark exists at the bottom of the body
  let footer = document.querySelector('footer');
  if (!footer) {
    footer = document.createElement('footer');
    document.body.appendChild(footer);
  }
}

// Export renderContent function for better maintainability
module.exports = {
  ... // Existing exports
  indexContent,
  dependencyGraphContent,
  renderContent, // Add renderContent to the list of exports
  addProperLandmarkRegions // Add addProperLandmarkRegions to the list of exports
};