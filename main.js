// TODO: Address accessibility issues from insight report:
// ... existing comment block

/**
 * Main application module
 * @module main
 */

// Ensure keyboard navigation for interactive elements
const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Initialize accessibility features
 */
function initializeAccessibility() {
  // Trap focus within modals for screen readers
  document.querySelectorAll('[role="dialog"]').forEach(modal => {
    modal.addEventListener('keydown', trapTabKey);
  });

  // Announce dynamic content changes to screen readers
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('role', 'status');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.className = 'sr-only';
  document.body.appendChild(liveRegion);
}

/**
 * Trap Tab key within focusable elements
 * @param {KeyboardEvent} e - Keyboard event
 */
function trapTabKey(e) {
  if (e.key !== 'Tab') return;
  
  const focusableContent = e.target.querySelectorAll(focusableElements);
  const firstFocusable = focusableContent[0];
  const lastFocusable = focusableContent[focusableContent.length - 1];

  if (e.shiftKey && document.activeElement === firstFocusable) {
    e.preventDefault();
    lastFocusable.focus();
  } else if (!e.shiftKey && document.activeElement === lastFocusable) {
    e.preventDefault();
    firstFocusable.focus();
  }
}

/**
 * Announce message to screen readers
 * @param {string} message - Message to announce
 */
function announceToScreenReader(message) {
  const liveRegion = document.querySelector('[role="status"]');
  if (liveRegion) {
    liveRegion.textContent = '';
    setTimeout(() => {
      liveRegion.textContent = message;
    }, 100);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAccessibility);
} else {
  initializeAccessibility();
}

// Preserve all existing exports
module.exports = {
  initializeAccessibility,
  trapTabKey,
  announceToScreenReader
};