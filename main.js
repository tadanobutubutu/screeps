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