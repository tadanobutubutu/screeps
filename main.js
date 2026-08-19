// Preserve all existing code from main.js
// ... (all your existing code remains unchanged)

// Add the new button element for the rotation functionality
document.addEventListener('DOMContentLoaded', function() {
  const unrotateButton = document.createElement('button');
  unrotateButton.id = 'unrotate';
  unrotateButton.textContent = 'rotate back';
  unrotateButton.addEventListener('click', function() {
    // Add your rotation logic here
    console.log('Rotation back action triggered');
  });

  // Insert the button where the link was
  const originalLink = document.getElementById('unrotate');
  if (originalLink) {
    originalLink.parentNode.replaceChild(unrotateButton, originalLink);
  }
});