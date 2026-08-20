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
    rotateBackLink.parentNode.replaceChild(button, rotateBackLink);
  }
}

// Initialize the enhancement when the DOM is loaded
document.addEventListener('DOMContentLoaded', enhanceDependencyGraph);

// Export any existing functions that need to be preserved
// (Add any existing exports here if they exist in the original file)