// Could you please paste the contents of `main.js`, especially the sections with conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`), so I can help resolve them?

// Accessibility Functions - Addressed from insight report
const accessibilityUtils = {
  // Announce messages to screen readers
  announceToScreenReader(message, politeness = 'polite') {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', politeness);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.setAttribute('class', 'sr-only');
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => announcement.remove(), 1000);
  },

  // Trap focus within a container (for modals, dialogs)
  trapFocus(container) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    return () => container.removeEventListener('keydown', handleTabKey);
  },

  // Check if user prefers reduced motion
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  // Check if user prefers high contrast
  prefersHighContrast() {
    return window.matchMedia('(prefers-contrast: more)').matches;
  },

  // Handle escape key to close modals/dropdowns
  handleEscapeKey(callback) {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') callback();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  },

  // Add skip link functionality
  initSkipLinks() {
    const skipLink = document.querySelector('[data-skip-link]');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(skipLink.getAttribute('href'));
        if (target) {
          target.tabIndex = -1;
          target.focus();
        }
      });
    }
  },

  // Set up keyboard navigation for custom components
  initKeyboardNavigation(selector, config = {}) {
    const items = document.querySelectorAll(selector);
    items.forEach((item, index) => {
      item.setAttribute('tabindex', index === 0 ? '0' : '-1');
      
      item.addEventListener('keydown', (e) => {
        let newIndex = index;
        
        switch (e.key) {
          case 'ArrowDown':
          case 'ArrowRight':
            newIndex = (index + 1) % items.length;
            break;
          case 'ArrowUp':
          case 'ArrowLeft':
            newIndex = (index - 1 + items.length) % items.length;
            break;
          case 'Home':
            newIndex = 0;
            break;
          case 'End':
            newIndex = items.length - 1;
            break;
          default:
            return;
        }
        
        e.preventDefault();
        items[newIndex].tabIndex = '0';
        items[index].tabIndex = '-1';
        items[newIndex].focus();
        
        if (config.onNavigate) config.onNavigate(newIndex, item);
      });
    });
  }
};

// Initialize accessibility features on DOM ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    accessibilityUtils.initSkipLinks();
  });
}

module.exports = { accessibilityUtils };