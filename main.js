// main.js
// ... (existing imports and code above)

/**
 * Handles the rotation back functionality for the dependency graph
 */
function handleRotateBack() {
  // Implement your rotation logic here
  console.log('Rotating back to original view');
  // Add any additional rotation logic needed
}

// ... (existing code below)

// Add event listener for the rotate back button
document.addEventListener('DOMContentLoaded', () => {
  const rotateBackButton = document.getElementById('unrotate');
  if (rotateBackButton) {
    rotateBackButton.addEventListener('click', (e) => {
      e.preventDefault();
      handleRotateBack();
    });
  }
});

// ... (rest of existing code)