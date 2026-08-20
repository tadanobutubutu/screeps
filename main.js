// main.js
// Preserve all existing code and exports
// Only adding the new function for the fake link fix

// ... [existing code remains unchanged] ...

/**
 * Handles the rotation back action for the dependency graph
 * Replaces the fake link with proper button behavior
 */
function handleRotateBack() {
  // Your existing rotation logic here
  // This should be the same as what was triggered by the fake link
  console.log('Rotating back to original view');
  // Add any additional rotation logic needed
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

// ... [rest of existing code remains unchanged] ...