// main.js
// Preserve all existing code and functionality
// Only add the new button element as requested

// [Your existing code here...]

// Add the new button element to replace the problematic <a> tag
const rotateBackButton = document.createElement('button');
rotateBackButton.id = 'unrotate';
rotateBackButton.textContent = 'rotate back';
rotateBackButton.addEventListener('click', () => {
  // Add your rotation back logic here
  console.log('Rotation back triggered');
});

// Replace the old <a> tag with the new button
document.addEventListener('DOMContentLoaded', () => {
  const oldLink = document.getElementById('unrotate');
  if (oldLink) {
    oldLink.parentNode.replaceChild(rotateBackButton, oldLink);
  }
});

// [Rest of your existing code...]