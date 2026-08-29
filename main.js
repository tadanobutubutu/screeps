export default function main() {
  return "Hello, World!";
}

export const version = "1.0.0";

// Accessibility utilities

/**
 * Creates a keyboard navigation handler for focusable elements
 * @param {string[]} allowedKeys - Array of allowed key names
 * @param {Function} callback - Function to call when allowed key is pressed
 */
export function handleKeyboardNavigation(allowedKeys, callback) {
  return (event) => {
    if (allowedKeys.includes(event.key)) {
      callback(event);
    }
  };
}

/**
 * Generates a unique ID for ARIA attributes
 */
let ariaIdCounter = 0;
export function generateAriaId() {
  return `aria-id-${++ariaIdCounter}`;
}

/**
 * Announces a message to screen readers using ARIA live regions
 * @param {string} message - The message to announce
 * @param {string} priority - 'polite' or 'assertive'
 */
export function announceToScreenReader(message, priority = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  const existing = document.querySelector('.sr-only-announcer');
  if (existing) {
    existing.remove();
  }
  
  announcement.className = 'sr-only-announcer';
  document.body.appendChild(announcement);
  
  setTimeout(() => announcement.remove(), 1000);
}

/**
 * Traps focus within a container element (for modals)
 * @param {HTMLElement} container - The element to trap focus within
 * @returns {Function} Cleanup function to remove the focus trap
 */
export function trapFocus(container) {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(', ');
  
  const elements = container.querySelectorAll(focusableSelectors);
  const first = elements[0];
  const last = elements[elements.length - 1];
  
  function handleTab(e) {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
  
  container.addEventListener('keydown', handleTab);
  container._focusTrapHandler = handleTab;
  
  return () => {
    container.removeEventListener('keydown', handleTab);
    delete container._focusTrapHandler;
  };
}