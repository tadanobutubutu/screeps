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

// Update for React SVG accessible name issue
const icons = {
  icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><title>Screeps Dashboard</title><text y=%22.9em%22 font-size=%2290%22>🐛</text></svg>',
  apple: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><title>Apple Icon</title><text y=%22.9em%22 font-size=%2290%22>🍎</text></svg>',
  favicon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22 aria-label=%22Screeps Dashboard%22><title>Screeps Dashboard</title><text y=%22.9em%22 font-size=%2290%22>🐛</text></svg>'
};

module.exports.icons = icons;