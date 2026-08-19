// Main application logic
(function() {
  'use strict';

  // Image rotation state
  let currentRotation = 0;
  const image = document.getElementById('target-image');

  /**
   * Rotates the image by the specified degrees
   * @param {number} degrees - The number of degrees to rotate
   */
  function rotateImage(degrees) {
    currentRotation += degrees;
    if (image) {
      image.style.transform = `rotate(${currentRotation}deg)`;
    }
  }

  /**
   * Resets the image rotation to 0 degrees
   */
  function resetRotation() {
    currentRotation = 0;
    if (image) {
      image.style.transform = 'rotate(0deg)';
    }
  }

  // Event listeners
  document.addEventListener('DOMContentLoaded', function() {
    const rotateButton = document.getElementById('rotate');
    const unrotateButton = document.getElementById('unrotate');

    if (rotateButton) {
      rotateButton.addEventListener('click', function() {
        rotateImage(90);
      });
    }

    if (unrotateButton) {
      unrotateButton.addEventListener('click', function() {
        resetRotation();
      });
    }
  });

  // Export functions for testing
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      rotateImage,
      resetRotation
    };
  }
})();