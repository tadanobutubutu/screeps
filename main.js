// Main application entry point
// TODO: Implement the required changes to improve accessibility
// Replaced with implementation

/**
 * Trap focus within a container element for accessibility (e.g., modals, dialogs)
 * @param {HTMLElement} container - The element to trap focus within
 */
export function trapFocus(container) {
  const focusableSelectors = 'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])';
  const focusableElements = container.querySelectorAll(focusableSelectors);
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  container.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstFocusable) {
        lastFocusable.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === lastFocusable) {
        firstFocusable.focus();
        e.preventDefault();
      }
    }
  });
}

/**
 * Add ARIA role and label attributes to an element for screen reader support
 * @param {HTMLElement} element - The DOM element to enhance
 * @param {string} role - The ARIA role (e.g., 'button', 'dialog', 'navigation')
 * @param {string} label - The accessible label
 */
export function addAriaAttributes(element, role, label) {
  if (element) {
    element.setAttribute('role', role);
    element.setAttribute('aria-label', label);
  }
}

/**
 * Create an ARIA live region to announce dynamic content changes to screen readers
 * @param {string} message - The message to announce
 * @param {string} priority - 'polite' or 'assertive'
 */
export function announceToScreenReader(message, priority = 'polite') {
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('aria-live', priority);
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.className = 'visually-hidden';
  liveRegion.style.position = 'absolute';
  liveRegion.style.left = '-9999px';
  liveRegion.textContent = message;
  document.body.appendChild(liveRegion);

  setTimeout(() => {
    if (document.body.contains(liveRegion)) {
      document.body.removeChild(liveRegion);
    }
  }, 1000);
}