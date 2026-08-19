// Existing code from main.js before conflict markers
// <<<<<<< HEAD
// ... existing code ...
// ========

// Required change to add the lang attribute to the root HTML element
document.documentElement.lang = 'en';

// ... existing code ...
// >>>>>>> origin/main

// Add event listener for the rotate back button
document.addEventListener('DOMContentLoaded', function() {
  const rotateBackButton = document.getElementById('unrotate');
  if (rotateBackButton) {
    rotateBackButton.addEventListener('click', function(e) {
      e.preventDefault();
      // Add your rotation logic here
      console.log('Rotate back action triggered');
    });
  }
});