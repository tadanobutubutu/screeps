// TODO: Address accessibility issues from insight report:

// Ensure keyboard accessibility and focus management for interactive elements
function initializeAccessibleComponents() {
  // Set up proper focus management for modal dialogs
  const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      // Close modals or dropdowns on Escape key
      const activeModal = document.querySelector('.modal[aria-hidden="false"]');
      if (activeModal) {
        activeModal.setAttribute('aria-hidden', 'true');
        const trigger = document.activeElement;
        trigger?.focus();
      }
    }
  });

  // Ensure all interactive elements have proper ARIA attributes
  document.querySelectorAll('[role="button"]').forEach((element) => {
    if (!element.hasAttribute('tabindex')) {
      element.setAttribute('tabindex', '0');
    }
    if (!element.hasAttribute('aria-label')) {
      const textContent = element.textContent.trim();
      if (!textContent) {
        console.warn('Interactive element missing accessible label');
      }
    }
  });

  // Announce dynamic content changes to screen readers
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.className = 'sr-only';
  liveRegion.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);';
  document.body.appendChild(liveRegion);
  
  return liveRegion;
}

// Export for use in other modules
module.exports = {
  initializeAccessibleComponents
};