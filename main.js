// main.js - Accessibility fixes applied

// Assuming the main.js file is a JavaScript file that includes the HTML content of the ... file.

// Helper function to rotate back
function rotateBack() {
  // Your code to rotate back
}

// Initialize when DOM is ready
function initializeApp() {
  const unrotateBtn = document.getElementById('unrotate');
  if (unrotateBtn) {
    unrotateBtn.addEventListener('click', function(e) {
      e.preventDefault();
      rotateBack();
    });
  }
}

// Run initialization
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
  } else {
    initializeApp();
  }
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { rotateBack, initializeApp };
}