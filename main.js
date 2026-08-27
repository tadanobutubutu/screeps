// Existing code

// Address accessibility issues from insight report - FIXED
function createAccessibleAlert(message) {
  const alert = document.createElement('div');
  alert.className = 'alert';
  alert.role = 'alert';
  alert.textContent = message;

  // Add additional ARIA attributes for better accessibility
  alert.ariaLabel = message;
  alert.ariaDescribedBy = 'alert-live-region';

  // Create an invisible focusable element to act as a live region
  const liveRegion = document.createElement('span');
  liveRegion.id = 'alert-live-region';
  liveRegion.setAttribute('aria-live', 'assertive');

  liveRegion.appendChild(alert);
  document.body.appendChild(liveRegion);
}

// Export the function
module.exports = { createAccessibleAlert };

// Existing code and exports left untouched