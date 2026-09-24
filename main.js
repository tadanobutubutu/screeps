// TODO: Address accessibility issues from insight report — FIXED
// main.js - Main application entry point

// Accessibility utilities
const A11yUtils = {
  // Focus management for modal dialogs
  trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    element.addEventListener('keydown', handleTabKey);
    return () => element.removeEventListener('keydown', handleTabKey);
  },

  // Announce messages to screen readers
  announce(message, priority = 'polite') {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => announcement.remove(), 1000);
  },

  // Keyboard navigation helper
  handleArrowNavigation(items, currentIndex, key) {
    let newIndex = currentIndex;
    if (key === 'ArrowDown' || key === 'ArrowRight') {
      newIndex = (currentIndex + 1) % items.length;
    } else if (key === 'ArrowUp' || key === 'ArrowLeft') {
      newIndex = (currentIndex - 1 + items.length) % items.length;
    }
    return newIndex;
  },

  // Reduce motion preference check
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
};

// Initialize accessibility features
function initAccessibility() {
  // Check for reduced motion preference
  if (A11yUtils.prefersReducedMotion()) {
    document.documentElement.classList.add('reduced-motion');
  }

  // Listen for preference changes
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
    document.documentElement.classList.toggle('reduced-motion', e.matches);
  });
}

// Main application initialization
function initApp() {
  initAccessibility();
  console.log('Application initialized with accessibility support');
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Export for testing and external use
export { A11yUtils, initAccessibility, initApp };