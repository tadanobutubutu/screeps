// main.js
// ... (preserve all existing code, exports, and functions from current main.js)

// Add the new button handler for the rotate back functionality
function handleRotateBack() {
  // Implement the rotation logic here
  // This should be the same functionality that was previously triggered by the fake link
  console.log('Rotating back');
  // Add any additional rotation logic needed
}

// Replace the fake link with a proper button
document.addEventListener('DOMContentLoaded', () => {
  const rotateBackLink = document.getElementById('unrotate');
  if (rotateBackLink) {
    const rotateBackButton = document.createElement('button');
    rotateBackButton.id = 'unrotate';
    rotateBackButton.textContent = 'rotate back';
    rotateBackButton.addEventListener('click', handleRotateBack);

    // Replace the link with the button
    rotateBackLink.parentNode.replaceChild(rotateBackButton, rotateBackLink);
  }
});