// Main application file

function rotateBack() {
  // Rotate back functionality
  const element = document.getElementById('unrotate');
  if (element) {
    // Reset rotation
    element.style.transform = 'rotate(0deg)';
  }
}

function createUI(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Create the rotate back button (not a fake link)
  const button = document.createElement('button');
  button.id = 'unrotate';
  button.textContent = 'rotate back';
  button.onclick = rotateBack;
  
  container.appendChild(button);
}

function init() {
  createUI('app');
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { rotateBack, createUI, init };
}

// Initialize when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}