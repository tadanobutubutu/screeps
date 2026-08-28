// TODO: Address accessibility issues from insight report:

// Accessibility helper functions
function announceToScreenReader(message, priority = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  setTimeout(() => announcement.remove(), 1000);
}

function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  element.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
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
    }
  });
}

function removeFocusOutline() {
  // Only remove outline if user is not navigating via keyboard
  if (!window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    return;
  }
  
  let hadKeyboardEvent = false;
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      hadKeyboardEvent = true;
      document.body.classList.add('user-is-tabbing');
    }
  });
  
  document.addEventListener('mousedown', () => {
    if (hadKeyboardEvent) {
      document.body.classList.remove('user-is-tabbing');
      hadKeyboardEvent = false;
    }
  });
}

// Initialize accessibility features
function initAccessibility() {
  removeFocusOutline();
  
  // Add skip link target if missing
  if (!document.getElementById('main-content')) {
    const main = document.querySelector('main') || document.querySelector('div[role="main"]');
    if (main) {
      main.id = 'main-content';
    }
  }
  
  // Ensure all interactive elements have accessible names
  document.querySelectorAll('button, a, input, select, textarea').forEach(element => {
    if (!element.getAttribute('aria-label') && 
        !element.getAttribute('aria-labelledby') && 
        !element.textContent.trim() && 
        !element.value) {
      console.warn(`Element missing accessible name:`, element);
    }
  });
}

// Export functions for testing and external use
module.exports = {
  announceToScreenReader,
  trapFocus,
  removeFocusOutline,
  initAccessibility
};

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccessibility);
  } else {
    initAccessibility();
  }
}

// Also export for ES modules if needed
if (typeof window !== 'undefined') {
  window.main = {
    announceToScreenReader,
    trapFocus,
    removeFocusOutline,
    initAccessibility
  };
}