// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)
//_Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
//<!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
//_Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
//<!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
//_Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
//<!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->
//_Commit: 7c71fe35502d1cacefd35e209f9d20be82c56fc3_
//<!-- todo-hash: 312aa8ea6e4c5e1c9430e4b7136c210eb9172dea -->
//_Commit: Address accessibility issues from insight report — FIXED

/**
 * Accessibility utilities for the application
 */
const AccessibilityUtils = {
  // ... Existing code ...

  /**
   * Notifies screen readers of a change in active element focus
   * @param {HTMLElement} element - The element that has been focused
   */
  notifyFocusChange(element) {
    // New function requested to handle focus change notification for screen readers
    if (element && document.activeElement !== element) {
      AccessibilityUtils.announceToScreenReader(`Focus moved to ${element.getAttribute('aria-labelledby') || element.textContent || element.tagName}`);
    }
  },

  /**
   * Ensures that the specified accessible name (`aria-label`) is set for any element with a `tabindex` attribute.
   */
  ensureAccessibleNameOnTabbable() {
    // New function requested to enforce accessible names for tabbable elements
    // Initial implementation focuses on buttons and form elements, but can be extended to additional tabbable elements as needed.
    const tabbableElements = document.querySelectorAll('button[tabindex]:not([aria-label]), input[tabindex]:not([aria-label]), select[tabindex]:not([aria-label]), textarea[tabindex]:not([aria-label])');

    tabbableElements.forEach((element) => {
      if (!element.hasAttribute('aria-label')) {
        element.setAttribute('aria-label', element.textContent || element.tagName);
      }
    });
  }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AccessibilityUtils };
}

// Initialize accessibility features on DOM ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    // Ensure skip link functionality if present
    const skipLink = document.querySelector('.skip-link, [href="#main-content"]');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(skipLink.getAttribute('href') || '#main-content');
        if (target) {
          target.setAttribute('tabindex', '-1');
          target.focus();
          AccessibilityUtils.notifyFocusChange(target);
        }
      });
    }

    // Ensure accessibility names for tabbable elements
    AccessibilityUtils.ensureAccessibleNameOnTabbable();
  });
}