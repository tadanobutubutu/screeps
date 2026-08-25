// main.js - Application entry point

/**
 * Rotates the page back to its original orientation
 * Previously used <a href="#"> which is an accessibility issue (REACT_036)
 * Fixed by using <button> instead for in-page actions
 */
function createControls() {
  const container = document.getElementById('controls');
  
  // Create the rotate back button (was previously an <a> with href="#")
  const rotateButton = document.createElement('button');
  rotateButton.id = 'unrotate';
  rotateButton.textContent = 'rotate back';
  rotateButton.addEventListener('click', function() {
    document.body.style.transform = 'rotate(0deg)';
    // Focus management for accessibility
    this.focus();
  });
  
  container.appendChild(rotateButton);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createControls);
} else {
  createControls();
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createControls };
}