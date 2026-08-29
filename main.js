import { dependencyGraphContent, indexContent } from './content';

// Existing code preserved above...

// New code to address accessibility issue as per the insight report:
// Adding an appropriate ARIA role to the dependencyGraph container
function updateDependencyGraphAccessibility() {
  // Assuming that the dependencyGraph container is an element with an id of 'dependencyGraph'
  const dependencyGraphContainer = document.getElementById('dependencyGraph');

  // Check if the container exists to prevent errors
  if (dependencyGraphContainer) {
    // Set the appropriate ARIA role (e.g., 'application' or 'navigation' depending on the context)
    dependencyGraphContainer.setAttribute('role', 'application');
    // Additional ARIA attributes can be set here as needed (e.g., 'aria-label', 'aria-labelledby', etc.)
  }
}

// Call the function to update the accessibility of the dependencyGraph container
updateDependencyGraphAccessibility();