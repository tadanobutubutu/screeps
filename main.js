// Main JavaScript file
document.addEventListener('DOMContentLoaded', function() {
  const unrotateBtn = document.getElementById('unrotate');

  // Adding a unique aria-label to the button for screen readers and keyboard navigation
  if (unrotateBtn) {
    unrotateBtn.setAttribute('aria-label', 'Rotate back');
  }

  // Rotate back functionality
  unrotateBtn.addEventListener('click', function() {
    document.body.style.transform = 'rotate(0deg)';
  });
});

// Screeps main entry point
module.exports.loop = function () {
  // Main game loop logic goes here
  // This is a minimal valid main.js for syntax checking
};