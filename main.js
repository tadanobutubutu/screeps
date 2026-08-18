// main.js

// Export the module for testing
export function initRotateBack() {
  const unrotateButton = document.getElementById('unrotate');
  if (unrotateButton) {
    unrotateButton.addEventListener('click', function(e) {
      e.preventDefault();
      // Rotate back logic would go here
      console.log('Rotate back clicked');
    });
  }
}

// Add lang attribute to prevent accessibility issue
document.documentElement.lang = 'en';

// Initialize when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRotateBack);
  } else {
    initRotateBack();
  }
}

// Expose for testing
if (typeof window !== 'undefined') {
  window.initRotateBack = initRotateBack;
}

// Export for accessibility issue resolution
module.exports = {
  // Add property for document.documentElement.lang
  setLanguage: function(language) {
    document.documentElement.lang = language;
  }
};