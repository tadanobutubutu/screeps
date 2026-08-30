/*
Could you please paste the contents of `main.js`, especially the sections with conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`), so I can help resolve them?
*/

// TODO: Address accessibility issues from insight report:

/**
 * Accessibility utilities for the application
 * @module a11y
 */

/**
 * Traps focus within a given element (for modals, dialogs, etc.)
 * @param {HTMLElement} element - The element to trap focus within
 * @returns {Function} Cleanup function to remove event listeners
 */
export function trapFocus(element) {
  if (!element || !(element instanceof HTMLElement)) {
    console.warn('trapFocus: Invalid element provided');
    return () => {};
  }

  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  function handleTabKey(e) {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable?.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable?.focus();
      }
    }
  }

  element.addEventListener('keydown', handleTabKey);
  firstFocusable?.focus();

  return () => {
    element.removeEventListener('keydown', handleTabKey);
  };
}

/**
 * Announces a message to screen readers using a live region
 * @param {string} message - The message to announce
 * @param {'polite' | 'assertive'} priority - The priority of the announcement
 */
export function announceToScreenReader(message, priority = 'polite') {
  const announcer = document.getElementById('a11y-announcer') || createAnnouncer();
  announcer.setAttribute('aria-live', priority);
  announcer.textContent = '';
  // Force reflow to ensure announcement is read
  announcer.offsetHeight;
  announcer.textContent = message;
}

function createAnnouncer() {
  const announcer = document.createElement('div');
  announcer.id = 'a11y-announcer';
  announcer.setAttribute('role', 'status');
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  Object.assign(announcer.style, {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: '0',
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: '0'
  });
  document.body.appendChild(announcer);
  return announcer;
}

/**
 * Adds keyboard event handlers for common interactive patterns
 * @param {HTMLElement} element - The element to enhance
 * @param {Object} options - Configuration options
 * @param {Function} [options.onEnter] - Handler for Enter key
 * @param {Function} [options.onSpace] - Handler for Space key
 * @param {Function} [options.onEscape] - Handler for Escape key
 * @param {Function} [options.onArrowKeys] - Handler for arrow keys
 * @returns {Function} Cleanup function
 */
export function addKeyboardSupport(element, options = {}) {
  if (!element || !(element instanceof HTMLElement)) {
    console.warn('addKeyboardSupport: Invalid element provided');
    return () => {};
  }

  const { onEnter, onSpace, onEscape, onArrowKeys } = options;

  function handleKeyDown(e) {
    switch (e.key) {
      case 'Enter':
        onEnter?.(e);
        break;
      case ' ':
        onSpace?.(e);
        break;
      case 'Escape':
        onEscape?.(e);
        break;
      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight':
        onArrowKeys?.(e);
        break;
    }
  }

  element.addEventListener('keydown', handleKeyDown);
  return () => element.removeEventListener('keydown', handleKeyDown);
}

/**
 * Ensures an element has proper ARIA attributes for its role
 * @param {HTMLElement} element - The element to check/enhance
 * @param {string} role - The expected ARIA role
 */
export function ensureAriaRole(element, role) {
  if (!element || !(element instanceof HTMLElement)) return;
  
  const currentRole = element.getAttribute('role');
  if (!currentRole) {
    element.setAttribute('role', role);
  }
}

/**
 * Manages focus restoration when opening/closing overlay components
 */
export class FocusManager {
  constructor() {
    this.previousActiveElement = null;
  }

  /** Saves current focus and optionally sets focus to a new element */
  saveFocus(newFocusTarget = null) {
    this.previousActiveElement = document.activeElement;
    if (newFocusTarget instanceof HTMLElement) {
      newFocusTarget.focus();
    }
  }

  /** Restores focus to the previously active element */
  restoreFocus() {
    if (this.previousActiveElement instanceof HTMLElement) {
      this.previousActiveElement.focus();
      this.previousActiveElement = null;
    }
  }
}

/**
 * Checks if an element is visible to screen readers
 * @param {HTMLElement} element - Element to check
 * @returns {boolean}
 */
export function isVisibleToScreenReader(element) {
  if (!element || !(element instanceof HTMLElement)) return false;
  
  const style = window.getComputedStyle(element);
  const isHidden = style.display === 'none' || 
                   style.visibility === 'hidden' || 
                   element.hasAttribute('hidden') ||
                   element.getAttribute('aria-hidden') === 'true';
  
  return !isHidden;
}

/**
 * Generates a unique ID for ARIA relationships
 * @param {string} prefix - Prefix for the ID
 * @returns {string}
 */
export function generateAriaId(prefix = 'a11y') {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}