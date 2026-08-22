// main.js - Application entry point

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('canvas-container');
  const unrotateBtn = document.getElementById('unrotate');
  
  // Canvas rotation functionality
  let currentRotation = 0;
  
  function rotateCanvas(degrees) {
    currentRotation += degrees;
    container.style.transform = `rotate(${currentRotation}deg)`;
  }
  
  // Rotate back - using button instead of fake link
  if (unrotateBtn) {
    unrotateBtn.addEventListener('click', () => {
      currentRotation = 0;
      container.style.transform = 'rotate(0deg)';
    });
  }
  
  // Export functions for testing
  window.CanvasApp = {
    rotateCanvas,
    getRotation: () => currentRotation,
    resetRotation: () => {
      currentRotation = 0;
      container.style.transform = 'rotate(0deg)';
    }
  };
});

module.exports = { CanvasApp };