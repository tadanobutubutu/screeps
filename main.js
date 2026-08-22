// TODO: Address accessibility issues from insight report:
// Placeholder for accessibility-related code changes

/**
 * Accessibility utilities for the application
 */

/**
 * Announces a message to screen readers using ARIA live regions
 * @param {string} message - The message to announce
 * @param {string} priority - 'polite' or 'assertive'
 */
export function announceToScreenReader(message, priority = 'polite') {
  let announcer = document.getElementById('sr-announcer');
  
  if (!announcer) {
    announcer = document.createElement('div');
    announcer.id = 'sr-announcer';
    announcer.setAttribute('role', 'status');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;';
    document.body.appendChild(announcer);
  }
  
  announcer.textContent = '';
  setTimeout(() => {
    announcer.textContent = message;
  }, 100);
}

/**
 * Handles keyboard navigation for modal dialogs
 * @param {KeyboardEvent} event - The keyboard event
 * @param {HTMLElement} modalElement - The modal element
 */
export function handleModalKeyboard(event, modalElement) {
  if (event.key === 'Escape') {
    modalElement.dispatchEvent(new CustomEvent('close-modal'));
    return;
  }
  
  if (event.key !== 'Tab') return;
  
  const focusableElements = modalElement.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  if (focusableElements.length === 0) return;
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  if (event.shiftKey) {
    if (document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    }
  } else {
    if (document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }
}

/**
 * Traps focus within a container element
 * @param {HTMLElement} container - The container to trap focus within
 * @returns {Function} Cleanup function to remove the trap
 */
export function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  function handleTab(event) {
    if (event.key !== 'Tab') return;
    
    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }
  
  container.addEventListener('keydown', handleTab);
  
  if (firstElement) {
    firstElement.focus();
  }
  
  return () => {
    container.removeEventListener('keydown', handleTab);
  };
}

/**
 * Checks if user prefers reduced motion
 * @returns {boolean}
 */
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Sets up reduced motion preference listener
 * @param {Function} callback - Function to call when preference changes
 * @returns {Function} Cleanup function
 */
export function onReducedMotionChange(callback) {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  
  const handler = (event) => callback(event.matches);
  
  mediaQuery.addEventListener('change', handler);
  
  return () => {
    mediaQuery.removeEventListener('change', handler);
  };
}

/**
 * Adds skip link functionality
 * @param {string} targetId - ID of the target element to skip to
 */
export function initSkipLink(targetId) {
  const skipLink = document.querySelector('a[href^="#"]');
  
  if (skipLink) {
    skipLink.addEventListener('click', (event) => {
      event.preventDefault();
      const target = document.getElementById(targetId);
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus();
        target.removeAttribute('tabindex');
      }
    });
  }
}

/**
 * Validates that an interactive element has proper accessible naming
 * @param {HTMLElement} element - The element to validate
 * @returns {boolean}
 */
export function hasAccessibleName(element) {
  const ariaLabel = element.getAttribute('aria-label');
  const ariaLabelledBy = element.getAttribute('aria-labelledby');
  const title = element.getAttribute('title');
  const textContent = element.textContent?.trim();
  
  return !!(ariaLabel || ariaLabelledBy || title || textContent);
}

/**
 * Initialize accessibility features
 */
export function initAccessibility() {
  // Set up ARIA live region for announcements
  if (!document.getElementById('sr-announcer')) {
    const announcer = document.createElement('div');
    announcer.id = 'sr-announcer';
    announcer.setAttribute('role', 'status');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;';
    document.body.appendChild(announcer);
  }
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccessibility);
  } else {
    initAccessibility();
  }
}