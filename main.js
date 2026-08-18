// main.js
// ... existing code ...

// Add this new function to handle the rotation
function handleRotation() {
  // Your rotation logic here
  console.log('Rotating back');
}

// ... rest of existing code ...

// Update the link in dependency-graph.html to use a button instead
// This would be in the HTML file, not in main.js, but since we're working with main.js,
// we'll need to ensure any event handlers are properly set up
document.addEventListener('DOMContentLoaded', () => {
  const rotateBackButton = document.getElementById('unrotate');
  if (rotateBackButton) {
    // Replace the link with a button
    const button = document.createElement('button');
    button.id = 'unrotate';
    button.textContent = 'rotate back';
    button.addEventListener('click', handleRotation);

    // Replace the old link with the new button
    rotateBackButton.parentNode.replaceChild(button, rotateBackButton);
  }
});