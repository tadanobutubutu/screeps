// TODO: Address accessibility issues from insight report:
// - Missing ARIA labels on interactive elements
// - Keyboard navigation support needed
// - Focus management improvements required

// Accessibility utility functions
const AccessibilityManager = {
  // Add ARIA label to element if missing
  ensureAriaLabel(element, label) {
    if (element && !element.getAttribute('aria-label')) {
      element.setAttribute('aria-label', label);
    }
  },

  // Set up keyboard navigation for a container
  setupKeyboardNavigation(container, options = {}) {
    const { onEnter, onSpace, onEscape, onArrowDown, onArrowUp } = options;
    
    container.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'Enter':
          if (onEnter) onEnter(e);
          break;
        case ' ':
          if (onSpace) {
            e.preventDefault();
            onSpace(e);
          }
          break;
        case 'Escape':
          if (onEscape) onEscape(e);
          break;
        case 'ArrowDown':
          if (onArrowDown) {
            e.preventDefault();
            onArrowDown(e);
          }
          break;
        case 'ArrowUp':
          if (onArrowUp) {
            e.preventDefault();
            onArrowUp(e);
          }
          break;
      }
    });
  },

  // Manage focus for modal/dialog interactions
  trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    element.addEventListener('keydown', handleTabKey);
    return () => element.removeEventListener('keydown', handleTabKey);
  },

  // Announce message to screen readers
  announce(message, priority = 'polite') {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);';
    announcer.textContent = message;
    document.body.appendChild(announcer);
    setTimeout(() => announcer.remove(), 1000);
  },

  // Restore focus to previous element
  returnFocus(element) {
    if (element && element.focus) {
      element.focus();
    }
  }
};

// Export for use in main.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AccessibilityManager;
}

// Main initialization
document.addEventListener('DOMContentLoaded', () => {
  // Initialize accessibility improvements
  initializeAccessibility();
});

function initializeAccessibility() {
  // Add ARIA labels to buttons without them
  document.querySelectorAll('button').forEach((button, index) => {
    if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
      button.setAttribute('aria-label', `Button ${index + 1}`);
    }
    // Ensure buttons are focusable
    if (!button.hasAttribute('tabindex')) {
      button.setAttribute('tabindex', '0');
    }
  });

  // Add ARIA labels to links without them
  document.querySelectorAll('a').forEach((link, index) => {
    if (!link.getAttribute('aria-label') && !link.textContent.trim()) {
      link.setAttribute('aria-label', `Link ${index + 1}`);
    }
  });

  // Add ARIA labels to inputs without them
  document.querySelectorAll('input, select, textarea').forEach((input, index) => {
    const id = input.getAttribute('id');
    if (!input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
      // Check if there's a label with matching for attribute
      const label = document.querySelector(`label[for="${id}"]`);
      if (!label) {
        input.setAttribute('aria-label', `Input ${index + 1}`);
      }
    }
  });

  // Set up keyboard navigation for navigation menus
  document.querySelectorAll('nav, [role="navigation"]').forEach((nav) => {
    AccessibilityManager.setupKeyboardNavigation(nav, {
      onArrowDown: (e) => {
        const focusable = nav.querySelector('a, button');
        if (focusable) focusable.focus();
      }
    });
  });

  // Ensure all interactive elements are properly exposed
  document.querySelectorAll('[onclick], [onkeydown], [role="button"]').forEach((el) => {
    if (!el.hasAttribute('tabindex') && !el.matches('a, button, input')) {
      el.setAttribute('tabindex', '0');
    }
    if (el.matches('[onclick]') && !el.hasAttribute('role')) {
      el.setAttribute('role', 'button');
    }
  });

  // Remove outline only when focus is via mouse (accessibility best practice)
  document.addEventListener('mousedown', (e) => {
    if (e.target.matches('button, a, [role="button"]')) {
      e.target.classList.add('mouse-focus');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.querySelectorAll('.mouse-focus').forEach((el) => {
        el.classList.remove('mouse-focus');
      });
    }
  });

  console.log('Accessibility improvements initialized');
}

// Existing functionality preserved below

// Global state management
const AppState = {
  data: {},
  listeners: [],

  set(key, value) {
    this.data[key] = value;
    this.notify(key, value);
  },

  get(key) {
    return this.data[key];
  },

  subscribe(callback) {
    this.listeners.push(callback);
  },

  notify(key, value) {
    this.listeners.forEach(cb => cb(key, value));
  }
};

// Utility functions
function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Export utilities
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    AccessibilityManager,
    AppState,
    formatDate,
    debounce,
    throttle
  };
}