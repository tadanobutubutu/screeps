// TODO: Address accessibility issues from insight report:

/**
 * Announces a message to screen readers using aria-live regions
 * @param {string} message - The message to announce
 * @param {string} priority - 'polite' or 'assertive'
 */
export function announceToScreenReader(message, priority = 'polite') {
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', priority);
  announcer.setAttribute('aria-atomic', 'true');
  announcer.setAttribute('class', 'sr-only');
  announcer.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);';
  announcer.textContent = message;
  document.body.appendChild(announcer);
  
  setTimeout(() => {
    document.body.removeChild(announcer);
  }, 1000);
}

/**
 * Traps focus within a modal or element for keyboard accessibility
 * @param {HTMLElement} element - The container element to trap focus within
 * @returns {Function} A cleanup function to remove the trap
 */
export function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  
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
  
  if (firstFocusable) {
    firstFocusable.focus();
  }
  
  return () => {
    element.removeEventListener('keydown', handleTabKey);
  };
}

/**
 * Handles escape key press for closing modals/dropdowns
 * @param {HTMLElement} element - The element to monitor
 * @param {Function} callback - Function to call when Escape is pressed
 */
export function handleEscapeKey(element, callback) {
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      callback();
    }
  };
  
  element.addEventListener('keydown', handleEscape);
  
  return () => {
    element.removeEventListener('keydown', handleEscape);
  };
}

/**
 * Adds keyboard navigation support for arrow keys in menus/lists
 * @param {HTMLElement} container - The container with navigable items
 * @param {string} itemSelector - CSS selector for navigable items
 * @returns {Function} Cleanup function
 */
export function addArrowKeyNavigation(container, itemSelector = '[role="option"], [role="menuitem"]') {
  const handleKeyDown = (e) => {
    const items = Array.from(container.querySelectorAll(itemSelector));
    const currentIndex = items.indexOf(document.activeElement);
    
    let nextIndex = -1;
    
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = items.length - 1;
        break;
      default:
        return;
    }
    
    if (nextIndex >= 0 && items[nextIndex]) {
      e.preventDefault();
      items[nextIndex].focus();
    }
  };
  
  container.addEventListener('keydown', handleKeyDown);
  
  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Updates page aria-live region for dynamic content changes
 */
export function initAccessibility() {
  if (!document.querySelector('[aria-live]')) {
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.id = 'a11y-announcer';
    liveRegion.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);';
    document.body.appendChild(liveRegion);
  }
}

// Initialize accessibility features on load
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccessibility);
  } else {
    initAccessibility();
  }
}

// Example: Usage in your existing code
// import { announceToScreenReader, trapFocus, handleEscapeKey } from './main.js';