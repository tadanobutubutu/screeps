// main.js
// Preserve all existing code and exports
// Only adding the new function to handle the rotate back action

// Existing code would be here...

/**
 * Handles the rotate back action for the dependency graph
 * Replaces the fake link with a proper button element
 */
function handleRotateBack() {
  const rotateBackButton = document.createElement('button');
  rotateBackButton.id = 'unrotate';
  rotateBackButton.textContent = 'rotate back';
  rotateBackButton.addEventListener('click', () => {
    // Add your rotation logic here
    console.log('Rotating back');
  });

  // Replace the old <a> element with the new <button>
  const oldLink = document.getElementById('unrotate');
  if (oldLink) {
    oldLink.parentNode.replaceChild(rotateBackButton, oldLink);
  }
}

// Initialize the rotation button when the page loads
document.addEventListener('DOMContentLoaded', handleRotateBack);

// Export all existing functions
// ... existing exports would be here ...