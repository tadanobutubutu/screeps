// TODO: Any additional changes requested in the issue
// main.js - Accessibility improvements implementation

/**
 * Applies basic accessibility improvements to the document.
 * Ensures the <main> element has a role attribute and adds
 * aria-labels where missing.
 */
function applyAccessibilityImprovements() {
  const mainElement = document.querySelector('main');
  if (mainElement) {
    mainElement.setAttribute('role', 'main');
  }

  document.querySelectorAll('button').forEach(button => {
    if (!button.getAttribute('aria-label')) {
      button.setAttribute('aria-label', 'Button');
    }
  });

  // Focus the first focusable element on page load
  const firstFocusable = document.querySelector('[tabindex]:not([tabindex="-1"])');
  if (firstFocusable) {
    firstFocusable.focus();
  }
}

// Apply improvements when the DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', applyAccessibilityImprovements);
} else {
  applyAccessibilityImprovements();
}