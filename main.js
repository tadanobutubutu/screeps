// main.js
// Rotate functionality for the application

function rotateImage(imageElement, degrees) {
  if (imageElement) {
    imageElement.style.transform = `rotate(${degrees}deg)`;
  }
}

function unrotateImage(imageElement) {
  if (imageElement) {
    imageElement.style.transform = 'rotate(0deg)';
  }
}

// Export functions for use elsewhere
export { rotateImage, unrotateImage };

// Example initialization (if running in browser)
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const image = document.getElementById('target-image');
    const unrotateBtn = document.getElementById('unrotate');
    
    if (unrotateBtn) {
      unrotateBtn.addEventListener('click', () => {
        unrotateImage(image);
      });
    }
  });
}