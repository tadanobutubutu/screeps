// TODO: Address accessibility issues from insight report:
// Placeholder for accessibility-related code changes

/**
 * Announces a message to screen readers
 * @param {string} message - The message to announce
 * @param {string} priority - 'polite' or 'assertive'
 */
export function announceToScreenReader(message, priority = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  setTimeout(() => announcement.remove(), 1000);
}

/**
 * Traps focus within an element (for modals, dialogs, etc.)
 * @param {HTMLElement} element - The element to trap focus within
 * @returns {Function} Cleanup function to remove the trap
 */
export function trapFocus(element) {
  const focusableElementsString = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const focusableElements = element.querySelectorAll(focusableElementsString);
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (e) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        lastFocusable.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        firstFocusable.focus();
        e.preventDefault();
      }
    }
  };

  element.addEventListener('keydown', handleKeyDown);
  
  return () => {
    element.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Checks if user prefers reduced motion
 * @returns {boolean}
 */
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Manages skip link functionality
 * @param {string} skipLinkId - The ID of the skip link element
 */
export function setupSkipLink(skipLinkId) {
  const skipLink = document.getElementById(skipLinkId);
  if (!skipLink) return;

  skipLink.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = skipLink.getAttribute('href').slice(1);
    const target = document.getElementById(targetId) || document.querySelector(targetId);
    if (target) {
      target.setAttribute('tabindex', '-1');
      target.focus();
    }
  });
}

export {};