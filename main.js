// main.js - Application entry point with accessibility improvements

// Accessibility utilities
const AccessibilityManager = {
  // Live region for screen reader announcements
  createLiveRegion() {
    const region = document.createElement('div');
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    region.setAttribute('role', 'status');
    region.className = 'sr-only';
    region.id = 'live-region';
    document.body.appendChild(region);
    return region;
  },

  // Announce message to screen readers
  announce(message, priority = 'polite') {
    const region = document.getElementById('live-region') || this.createLiveRegion();
    region.setAttribute('aria-live', priority);
    region.textContent = '';
    setTimeout(() => {
      region.textContent = message;
    }, 100);
  },

  // Focus management - move focus to target element
  focusElement(selector) {
    const element = typeof selector === 'string' 
      ? document.querySelector(selector) 
      : selector;
    if (element && typeof element.focus === 'function') {
      element.focus();
      return true;
    }
    return false;
  },

  // Trap focus within a container (for modals/dialogs)
  trapFocus(container) {
    const focusableElements = container.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    return () => container.removeEventListener('keydown', handleTabKey);
  },

  // Handle escape key to close modals
  handleEscapeKey(callback) {
    return (e) => {
      if (e.key === 'Escape') {
        callback();
      }
    };
  },

  // Reduce motion preference detection
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  // High contrast mode detection
  isHighContrastMode() {
    return window.matchMedia('(forced-colors: active)').matches;
  }
};

// TODO: Implement the required changes to improve accessibility
// Placeholder implementation – actual accessibility enhancements would be added here

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    AccessibilityManager
  };
}

// Global accessibility object
window.AccessibilityManager = AccessibilityManager;