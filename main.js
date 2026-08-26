// main.js - Insight React Fix

// Sample data structure
const state = {
  rotated: false,
  items: []
};

// Function to rotate content (in-page action)
function rotateContent() {
  state.rotated = !state.rotated;
  const content = document.getElementById('content');
  if (content) {
    content.classList.toggle('rotated', state.rotated);
  }
}

// Function to reset rotation
function unrotateContent() {
  state.rotated = false;
  const content = document.getElementById('content');
  if (content) {
    content.classList.remove('rotated');
  }
}

// Initialize the application
function init() {
  const rotateBtn = document.getElementById('rotate');
  const unrotateBtn = document.getElementById('unrotate');
  
  if (rotateBtn) {
    rotateBtn.addEventListener('click', rotateContent);
  }
  
  if (unrotateBtn) {
    unrotateBtn.addEventListener('click', unrotateContent);
  }
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    rotateContent,
    unrotateContent,
    init,
    state
  };
}

// Initialize when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}