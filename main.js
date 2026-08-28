// TODO: Address accessibility issues from insight report:

// Accessibility helper functions

/**
 * Announce a message to screen readers
 * @param {string} message - The message to announce
 * @param {string} politeness - 'polite' or 'assertive'
 */
function announceToScreenReader(message, politeness = 'polite') {
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', politeness);
  announcer.setAttribute('aria-atomic', 'true');
  announcer.setAttribute('class', 'sr-only');
  announcer.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);';
  announcer.textContent = message;
  document.body.appendChild(announcer);
  setTimeout(() => announcer.remove(), 1000);
}

/**
 * Trap focus within an element (for modals/dialogs)
 * @param {HTMLElement} container - The container element
 */
function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  container.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  });
}

/**
 * Check if user prefers reduced motion
 * @returns {boolean}
 */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Make elements keyboard accessible
 * @param {string} selector - CSS selector for elements to make accessible
 */
function enhanceKeyboardAccessibility(selector) {
  document.querySelectorAll(selector).forEach(element => {
    if (!element.hasAttribute('tabindex') && !element.matches('button, input, select, textarea, a[href]')) {
      element.setAttribute('tabindex', '0');
    }
    element.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (element.tagName !== 'INPUT' && element.tagName !== 'TEXTAREA') {
          e.preventDefault();
          element.click();
        }
      }
    });
  });
}

// Initialize accessibility enhancements on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    enhanceKeyboardAccessibility('[data-accessible]');
  });
} else {
  enhanceKeyboardAccessibility('[data-accessible]');
}