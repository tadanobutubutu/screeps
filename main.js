// main.js - Accessibility improvements

// TODO: Address accessibility issues from insight report — CONTINUING
// Add new functions (no existing functions should be removed or renamed)

/**
 * Sets focus on an element with accessibility support
 * @param {HTMLElement} element - The element to focus
 * @param {Object} options - Focus options
 */
function setFocus(element, options = {}) {
  if (!element || typeof element.focus !== 'function') return;
  
  const { preventScroll = false } = options;
  element.focus({ preventScroll });
  
  // Announce focus change to screen readers
  if (element.getAttribute('aria-label')) {
    announceToScreenReader(`Focused on ${element.getAttribute('aria-label')}`);
  }
}

/**
 * Traps focus within a container (for modals, dialogs, etc.)
 * @param {HTMLElement} container - The container to trap focus within
 * @returns {Function} Cleanup function to remove the trap
 */
function trapFocus(container) {
  if (!container) return () => {};

  const focusableSelectors = [
    'button:not([disabled])',
    'a[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"]):not([disabled])'
  ].join(',');

  const focusableElements = container.querySelectorAll(focusableSelectors);
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  function handleKeyDown(e) {
    if (e.key !== 'Tab') return;

    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }

  container.addEventListener('keydown', handleKeyDown);

  // Return cleanup function
  return function releaseFocus() {
    container.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Announces a message to screen readers using ARIA live regions
 * @param {string} message - The message to announce
 * @param {string} priority - 'polite' or 'assertive'
 */
function announceToScreenReader(message, priority = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    if (announcement.parentNode) {
      announcement.parentNode.removeChild(announcement);
    }
  }, 1000);
}

/**
 * Manages roving tabindex for accessible component navigation
 * @param {HTMLElement} container - The container with focusable children
 * @param {string} selector - CSS selector for focusable items
 */
function initRovingTabindex(container, selector = '[role="option"], [role="tab"], [role="menuitem"]') {
  if (!container) return;

  const items = Array.from(container.querySelectorAll(selector));
  
  items.forEach((item, index) => {
    item.setAttribute('tabindex', index === 0 ? '0' : '-1');
    
    item.addEventListener('keydown', (e) => {
      let targetIndex = index;

      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          targetIndex = (index + 1) % items.length;
          e.preventDefault();
          break;
        case 'ArrowUp':
        case 'ArrowLeft':
          targetIndex = (index - 1 + items.length) % items.length;
          e.preventDefault();
          break;
        case 'Home':
          targetIndex = 0;
          e.preventDefault();
          break;
        case 'End':
          targetIndex = items.length - 1;
          e.preventDefault();
          break;
        default:
          return;
      }

      items[targetIndex].setAttribute('tabindex', '0');
      items[index].setAttribute('tabindex', '-1');
      setFocus(items[targetIndex]);
    });
  });
}

/**
 * Returns keyboard focus to the last active element
 * @param {HTMLElement} previousElement - The element to return focus to
 */
function returnFocus(previousElement) {
  if (previousElement && typeof previousElement.focus === 'function') {
    setFocus(previousElement);
  }
}

/**
 * Checks if user prefers reduced motion
 * @returns {boolean}
 */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Handles escape key to close modals/dropdowns/accessibility dialogs
 * @param {Function} closeHandler - Function to call when Escape is pressed
 */
function handleEscapeKey(closeHandler) {
  if (typeof closeHandler !== 'function') return;

  function onKeyDown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeHandler();
    }
  }

  document.addEventListener('keydown', onKeyDown);

  return function cleanup() {
    document.removeEventListener('keydown', onKeyDown);
  };
}