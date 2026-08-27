// Main application logic
(function() {
  'use strict';

  // DOM Elements
  const imageElement = document.getElementById('target-image');
  const unrotateButton = document.getElementById('unrotate');
  
  let currentRotation = 0;
  
  /**
   * Rotates the image by the specified degrees
   * @param {number} degrees - The amount of degrees to rotate
   */
  function rotateImage(degrees) {
    currentRotation += degrees;
    if (imageElement) {
      imageElement.style.transform = `rotate(${currentRotation}deg)`;
    }
  }
  
  /**
   * Resets the image rotation to 0 degrees
   */
  function resetRotation() {
    currentRotation = 0;
    if (imageElement) {
      imageElement.style.transform = 'rotate(0deg)';
    }
  }
  
  // Event Listeners
  if (unrotateButton) {
    // Use button element instead of anchor for accessibility
    unrotateButton.addEventListener('click', function(e) {
      e.preventDefault();
      resetRotation();
    });
  }
  
  // Export functions for testing/module use
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      rotateImage,
      resetRotation,
      getCurrentRotation: function() { return currentRotation; }
    };
  }
  
  // Global exposure
  window.RotateApp = {
    rotateImage,
    resetRotation,
    getCurrentRotation: function() { return currentRotation; }
  };
})();