// main.js - Application entry point

// Initialize the application
function initApp() {
  const canvas = document.getElementById('canvas');
  const unrotateBtn = document.getElementById('unrotate');
  
  // Rotate functionality
  let rotation = 0;
  
  function rotate() {
    rotation += 90;
    canvas.style.transform = `rotate(${rotation}deg)`;
  }
  
  function resetRotation() {
    rotation = 0;
    canvas.style.transform = `rotate(${rotation}deg)`;
  }
  
  // Attach event listeners
  canvas.addEventListener('click', rotate);
  
  // Fixed: Changed <a href="#"> to <button> for accessibility (REACT_036)
  // Using button element for in-page actions ensures proper keyboard 
  // and screen reader behavior
  if (unrotateBtn) {
    unrotateBtn.addEventListener('click', resetRotation);
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initApp };
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
}