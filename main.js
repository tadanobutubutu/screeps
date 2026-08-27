// TODO: Address accessibility issues from insight report:
// - ... (You can add more functions as needed)

// Helper function to generate unique IDs for ARIA attributes
let accessibilityIdCounter = 0;
export function generateId(prefix = 'a11y') {
  return `${prefix}-${++accessibilityIdCounter}`;
}

// Trap focus within a container element (for modals, dialogs, etc.)
export function trapFocus(container) {
  if (!container) return;

  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  function handleKeyDown(e) {
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
  }

  container.addEventListener('keydown', handleKeyDown);
  
  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
}

// Announce message to screen readers
export function announceToScreenReader(message, priority = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.setAttribute('role', 'status');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// Check if user prefers reduced motion
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}