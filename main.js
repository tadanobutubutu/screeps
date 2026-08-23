// Main application logic

// Fix for REACT_036 - Replace fake link with button for accessibility
// The original <a href="#">rotate back</a> has been changed to <button>rotate back</button>

// Rotate functionality
const rotateBtn = document.getElementById('unrotate');
const targetElement = document.getElementById('target'); // Adjust selector as needed

let isRotated = false;

if (rotateBtn && targetElement) {
  rotateBtn.addEventListener('click', function() {
    isRotated = !isRotated;
    if (isRotated) {
      targetElement.style.transform = 'rotate(180deg)';
    } else {
      targetElement.style.transform = 'rotate(0deg)';
    }
  });
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { rotateBtn, targetElement, isRotated };
}