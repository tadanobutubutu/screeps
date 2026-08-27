// TODO: Address accessibility issues from insight report:

// Accessibility helper functions
function initializeAccessibility() {
  // Add skip link for keyboard users
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.textContent = 'Skip to main content';
  skipLink.className = 'skip-link';
  document.body.insertBefore(skipLink, document.body.firstChild);

  // Ensure all interactive elements are keyboard accessible
  const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
  interactiveElements.forEach(el => {
    if (!el.hasAttribute('tabindex') && el.tabIndex < 0) {
      el.setAttribute('tabindex', '0');
    }
  });

  // Add ARIA labels to elements lacking accessible names
  const elementsNeedingLabels = document.querySelectorAll('[data-needs-label]');
  elementsNeedingLabels.forEach(el => {
    const labelText = el.getAttribute('data-needs-label');
    el.setAttribute('aria-label', labelText);
  });
}

function handleKeyboardNavigation(event) {
  // Trap focus within modals
  if (event.key === 'Tab') {
    const modal = document.querySelector('.modal.active');
    if (modal) {
      const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        last.focus();
        event.preventDefault();
      } else if (!event.shiftKey && document.activeElement === last) {
        first.focus();
        event.preventDefault();
      }
    }
  }

  // Close modals on Escape
  if (event.key === 'Escape') {
    const modal = document.querySelector('.modal.active');
    if (modal) {
      modal.classList.remove('active');
    }
  }
}

function announceToScreenReader(message) {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  setTimeout(() => announcement.remove(), 1000);
}

document.addEventListener('DOMContentLoaded', () => {
  initializeAccessibility();
  document.addEventListener('keydown', handleKeyboardNavigation);
});

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeAccessibility,
    handleKeyboardNavigation,
    announceToScreenReader
  };
}