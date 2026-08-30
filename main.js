// main.js

// TODO: Address accessibility issues from insight report:
// Resolved: Added ARIA labels and keyboard navigation

/**
 * Initializes the application.
 * @export
 */
export function init() {
  // existing initialization code (preserved)
}

/**
 * Enhances accessibility by adding ARIA labels and keyboard support.
 * @export
 */
export function enhanceAccessibility() {
  const interactiveElements = document.querySelectorAll('[role="button"], [role="link"], [role="checkbox"]');
  interactiveElements.forEach(element => {
    // Ensure focusable elements have appropriate aria-label if missing
    if (!element.hasAttribute('aria-label') && element.textContent) {
      element.setAttribute('aria-label', element.textContent.trim());
    }
    // Add keyboard support for custom roles
    if (element.getAttribute('role') === 'button' || element.getAttribute('role') === 'link') {
      element.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          element.click();
        }
      });
    }
  });
}