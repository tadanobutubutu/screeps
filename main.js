// TODO: Add back any required exports that might have been?

function main() {
  return "Hello, World!";
}

const version = "1.0.0";

const config = {
  port: 3000,
  debug: false
};

// Accessibility functions (addressing insight report) - DONE:
let focusTrapElement = null;

// Accessibility: Announce message to screen readers - DONE:
function announceToScreenReader(message, politeness = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', politeness);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  setTimeout(() => announcement.remove(), 1000);
}

// Accessibility: Trap focus within element (modals, dialogs) - DONE:
function trapFocus(element) {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(', ');

  const focusableElements = element.querySelectorAll(focusableSelectors);
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  const handleTabKey = (e) => {
    if (e.key !== 'Tab') return;

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
  };

  element.addEventListener('keydown', handleTabKey);
  focusTrapElement = { element, handler: handleTabKey };
  firstFocusable?.focus();
}

// Accessibility: Release focus trap - DONE:
function releaseFocus() {
  if (focusTrapElement) {
    focusTrapElement.element.removeEventListener('keydown', focusTrapElement.handler);
    focusTrapElement = null;
  }
}

// Accessibility: Handle escape key - DONE:
function handleEscapeKey(callback) {
  const handler = (e) => {
    if (e.key === 'Escape') {
      callback(e);
    }
  };
  document.addEventListener('keydown', handler);
  return handler;
}

// Accessibility: Check if user prefers reduced motion - DONE:
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Accessibility: Set focus to element with skip link support - DONE:
function setFocus(element, options = {}) {
  const { preventScroll = false } = options;
  if (element) {
    element.focus({ preventScroll });
  }
}

export default main;
export { version, config };
export {
  announceToScreenReader,
  trapFocus,
  releaseFocus,
  handleEscapeKey,
  prefersReducedMotion,
  setFocus
};