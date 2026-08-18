// Main JavaScript file
// This file handles the rotate functionality and other interactions

(function() {
  'use strict';

  // Rotate functionality
  const unrotateBtn = document.getElementById('unrotate');
  
  if (unrotateBtn) {
    unrotateBtn.addEventListener('click', function() {
      // Rotate back logic
      const image = document.querySelector('.rotatable-image');
      if (image) {
        image.style.transform = 'rotate(0deg)';
      }
    });
  }

  // Export for testing
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      handleUnrotate: function() {
        const image = document.querySelector('.rotatable-image');
        if (image) {
          image.style.transform = 'rotate(0deg)';
        }
      }
    };
  }
})();