// Preserve all existing code from main.js
// ... (all original content remains unchanged)

// Add the new function to handle the rotation back action
function handleRotateBack() {
  // Implement the rotation back logic here
  // For example:
  const graphElement = document.getElementById('dependency-graph');
  if (graphElement) {
    // Reset any transformations applied to the graph
    graphElement.style.transform = 'rotate(0deg)';
  }
}

// Replace the fake link with a proper button
document.addEventListener('DOMContentLoaded', () => {
  const rotateBackLink = document.getElementById('unrotate');
  if (rotateBackLink) {
    // Create a new button element
    const rotateBackButton = document.createElement('button');
    rotateBackButton.id = 'unrotate';
    rotateBackButton.textContent = 'rotate back';
    rotateBackButton.className = rotateBackLink.className;
    rotateBackButton.addEventListener('click', handleRotateBack);

    // Replace the link with the button
    rotateBackLink.parentNode.replaceChild(rotateBackButton, rotateBackLink);
  }
});

// All existing exports remain unchanged
// ... (rest of the original file)