/**
 * Accessibility utility functions for improved a11y compliance
 * Addresses insights from accessibility report
 */

// TODO: Address accessibility issues from insight report:
// Placeholder for accessibility-related code changes

/**
 * Manages focus for accessibility - ensures focus moves correctly for keyboard users
 * @param {HTMLElement} element - Element to focus
 */
export function manageFocus(element) {
  if (element && typeof element.focus === 'function') {
    element.focus();
  }
}

/**
 * Announces content to screen readers using ARIA live regions
 * @param {string} message - Message to announce
 * @param {string} priority - 'polite' or 'assertive'
 */
export function announceToScreenReader(message, priority = 'polite') {
  let announcement = document.getElementById('sr-announcer');
  if (!announcement) {
    announcement = document.createElement('div');
    announcement.id = 'sr-announcer';
    announcement.setAttribute('role', 'status');
    announcement.className = 'sr-only';
    document.body.appendChild(announcement);
  }
  announcement.setAttribute('aria-live', priority);
  announcement.textContent = '';
  setTimeout(() => {
    announcement.textContent = message;
  }, 50);
}

/**
 * Checks if user prefers reduced motion
 * @returns {boolean}
 */
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Handles keyboard navigation for custom components
 * @param {KeyboardEvent} event
 * @param {Object} options - Configuration options
 * @param {string[]} options.validKeys - Array of valid keys
 * @param {Function} options.onActivate - Callback when activated
 */
export function handleKeyboardNavigation(event, options = {}) {
  const { validKeys = ['Enter', ' '], onActivate } = options;
  if (validKeys.includes(event.key)) {
    event.preventDefault();
    if (typeof onActivate === 'function') {
      onActivate(event);
    }
  }
}

/**
 * Traps focus within a container for modals/dialogs
 * @param {HTMLElement} container - Container element
 * @param {KeyboardEvent} event - Keyboard event
 */
export function trapFocus(container, event) {
  if (event.key !== 'Tab') return;
  
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
}

/**
 * Checks color contrast compliance
 * @param {string} foreground - Foreground color hex
 * @param {string} background - Background color hex
 * @returns {Object} - { ratio: number, passesAA: boolean, passesAAA: boolean }
 */
export function checkColorContrast(foreground, background) {
  const getLuminance = (hex) => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    const [rs, gs, bs] = [r / 255, g / 255, b / 255].map(c =>
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    );
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

  return {
    ratio: Math.round(ratio * 100) / 100,
    passesAA: ratio >= 4.5,
    passesAAA: ratio >= 7
  };
}