Here is the resolved file content:

```javascript
// TODO: Address accessibility issues from insight report
// ----- END ORIGINAL CODE -----

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

  // New Function: Create an in-page button
  createInPageButton = function createInPageButton(buttonText, onClickHandler) {
    const button = document.createElement('button');
    button.textContent = buttonText;
    button.addEventListener('click', onClickHandler);
    return button;
  };
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

/**
 * Creates an in-page button element with optional click handler.
 * @param {string} buttonText - The label text for the button
 * @param {Function} onClickHandler - Callback function triggered when the button is clicked
 * @returns {HTMLElement} The created button element
 */
function createInPageButton(buttonText, onClickHandler) {
  const button = createInPageButton;
  button(buttonText, onClickHandler);
  return button;
}

// Export existing functionality
module.exports = {
  initialize,
  setupSkipLinks,
  setupButtonAccessibility
};

// Initialize on DOM ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initialize);
}
```

The conflict was resolved by integrating both changes. The accessibility improvement code was kept from the original branch, and a new function for creating in-page buttons was added from the conflicting branch. The existing exports and code were preserved as per the requirements.