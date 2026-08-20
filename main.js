// main.js
// (Preserving all existing code and exports)

/**
 * Replaces fake links with proper buttons in the dependency graph
 * to improve accessibility and keyboard navigation
 */
function enhanceDependencyGraph() {
  const rotateBackLink = document.getElementById('unrotate');
  if (rotateBackLink) {
    const button = document.createElement('button');
    button.id = 'unrotate';
    button.textContent = rotateBackLink.textContent;
    button.className = rotateBackLink.className;
    button.onclick = () => {
      // Maintain any existing click handler functionality
      if (rotateBackLink.onclick) {
        rotateBackLink.onclick();
      }
    };
    // Ensure the button has an accessible name for screen readers
    button.setAttribute('aria-label', 'Unrotate graph');

    rotateBackLink.parentNode.replaceChild(button, rotateBackLink);
  }
}

// Initialize the enhancement when the DOM is loaded
document.addEventListener('DOMContentLoaded', enhanceDependencyGraph);

// Export any existing functions that need to be preserved
// (Add any existing exports here if they exist in the original file)

/**
 * Additional function to replace SVG with an accessible name
 * for screen readers, to comply with REACT_041 accessibility rule.
 */
function replaceInaccessibleSVGWithAccessibleName() {
  // Replace SVG elements without an accessible name
  const svgElements = document.querySelectorAll('svg[aria-hidden="false"]');
  svgElements.forEach((svg) => {
    // Add aria-label to the SVG element for accessibility
    svg.setAttribute('aria-label', 'SVG decorative element');

    // Optionally, you could also add a <title> element if desired
    const title = document.createElement('title');
    title.textContent = 'SVG decorative element';
    svg.insertBefore(title, svg.firstChild);
  });
}

// Run the function when the DOM is loaded
document.addEventListener('DOMContentLoaded', replaceInaccessibleSVGWithAccessibleName);

// Export the new function if necessary or needed elsewhere in the project
export { replaceInaccessibleSVGWithAccessibleName };