// New function or changes requested in the issue
const addAccessibleNameToSVG = (svgElement) => {
  // Check if the SVG element already has an accessible name
  if (!svgElement.getAttribute('aria-label') && !svgElement.querySelector('title') && !svgElement.getAttribute('aria-hidden')) {
    // Add aria-label attribute if no accessible name is present
    svgElement.setAttribute('aria-label', 'Descriptive text for SVG');
  }
};

// Function to process all SVG elements in the DOM
const processSVGElements = () => {
  // Select all SVG elements in the DOM
  const svgElements = document.querySelectorAll('svg');

  // Iterate over each SVG element and add an accessible name if necessary
  svgElements.forEach((svg) => {
    addAccessibleNameToSVG(svg);
  });
};

// Call the function to process SVG elements when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', processSVGElements);

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