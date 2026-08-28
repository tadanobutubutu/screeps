// TODO: Address accessibility issues from insight report
// ----- END ORIGINAL CODE -----

/**
 * Creates an in-page button element with optional click handler.
 * @param {string} buttonText - The label text for the button
 * @param {Function} onClickHandler - Callback function triggered when the button is clicked
 * @returns {HTMLElement} The created button element
 */
function createInPageButton(buttonText, onClickHandler) {
  const button = document.createElement('button');
  button.textContent = buttonText;
  button.addEventListener('click', onClickHandler);
  return button;
}

// TODO: Implement this function for creating in-page buttons
// (Implementation added above)

/**
 * Initialize the application with accessibility improvements
 */
function initialize() {
  // Existing initialization logic preserved
  console.log('Application initialized');
  
  // Accessibility: Ensure main content is keyboard accessible
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    mainContent.setAttribute('tabindex', '-1');
    mainContent.removeAttribute('aria-hidden');
  }
  
  // Accessibility: Add skip link functionality
  setupSkipLinks();
  
  // Accessibility: Ensure buttons have proper labels
  setupButtonAccessibility();
}

/**
 * Setup skip link functionality for keyboard navigation
 */
function setupSkipLinks() {
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(skipLink.getAttribute('href'));
      if (target) {
        target.focus();
        target.scrollIntoView();
      }
    });
  }
}

/**
 * Ensure buttons have proper accessibility attributes
 */
function setupButtonAccessibility() {
  const buttons = document.querySelectorAll('button');
  buttons.forEach((button) => {
    if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
      button.setAttribute('aria-label', 'Action button');
    }
  });
}

// Existing exports and code remain unchanged
// Note: Preserving all existing code and exports as per requirements

// Export existing functionality
module.exports = {
  initialize,
  setupSkipLinks,
  setupButtonAccessibility,
  createInPageButton
};

// Initialize on DOM ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initialize);
}