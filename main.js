/**
 * Main JavaScript file
 * Implements accessibility improvements
 */

// TODO: Implement the required changes to improve accessibility

/**
 * Accessibility Helper Functions
 * Provides utilities for creating accessible web applications
 */

/**
 * Manages focus for accessibility
 * @param {HTMLElement} element - The element to focus
 * @param {Object} options - Focus options
 */
function manageFocus(element, options = {}) {
  if (!element) return;
  
  const focusOptions = {
    preventScroll: options.preventScroll || false,
    focusVisible: options.focusVisible || true
  };
  
  element.focus(focusOptions);
  
  if (focusOptions.focusVisible) {
    element.classList.add('focus-visible');
  }
}

/**
 * Handles keyboard navigation
 * @param {KeyboardEvent} event - The keyboard event
 * @param {Object} config - Navigation configuration
 */
function handleKeyboardNavigation(event, config = {}) {
  const key = event.key;
  const expectedKeys = config.keys || ['ArrowUp', 'ArrowDown', 'Enter', 'Escape'];
  
  if (expectedKeys.includes(key)) {
    event.preventDefault();
    
    if (config.onKeyDown && typeof config.onKeyDown === 'function') {
      config.onKeyDown(key, event);
    }
  }
}

/**
 * Manages ARIA attributes
 * @param {HTMLElement} element - The element to update
 * @param {Object} attributes - ARIA attributes to set
 */
function setAriaAttributes(element, attributes) {
  if (!element) return;
  
  Object.entries(attributes).forEach(([key, value]) => {
    const attrName = key.startsWith('aria-') ? key : `aria-${key}`;
    element.setAttribute(attrName, value);
  });
}

/**
 * Creates a live region for screen reader announcements
 * @param {string} message - Message to announce
 * @param {string} priority - 'polite' or 'assertive'
 */
function announceToScreenReader(message, priority = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.textContent = message;
  announcement.style.position = 'absolute';
  announcement.style.width = '1px';
  announcement.style.height = '1px';
  announcement.style.padding = '0';
  announcement.style.margin = '-1px';
  announcement.style.overflow = 'hidden';
  announcement.style.clip = 'rect(0, 0, 0, 0)';
  announcement.style.whiteSpace = 'nowrap';
  announcement.style.border = '0';
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Traps focus within an element (for modals/dialogs)
 * @param {HTMLElement} container - The container element
 * @returns {Function} Cleanup function to remove trap
 */
function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];
  
  function handleTab(event) {
    if (event.key !== 'Tab') return;
    
    if (event.shiftKey) {
      if (document.activeElement === firstFocusable) {
        lastFocusable.focus();
        event.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        firstFocusable.focus();
        event.preventDefault();
      }
    }
  }
  
  container.addEventListener('keydown', handleTab);
  firstFocusable?.focus();
  
  return () => {
    container.removeEventListener('keydown', handleTab);
  };
}

/**
 * Removes focus trap
 * @param {HTMLElement} container - The container element
 */
function removeFocusTrap(container) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  if (focusableElements.length > 0) {
    focusableElements[0].focus();
  }
}

/**
 * Validates form accessibility
 * @param {HTMLFormElement} form - The form to validate
 * @returns {Object} Validation result
 */
function validateFormAccessibility(form) {
  const result = { valid: true, errors: [] };
  const inputs = form.querySelectorAll('input, select, textarea');
  
  inputs.forEach(input => {
    const label = form.querySelector(`label[for="${input.id}"]`) || 
                  input.closest('label');
    
    if (!label && !input.getAttribute('aria-label') && 
        !input.getAttribute('aria-labelledby')) {
      result.valid = false;
      result.errors.push({
        element: input,
        message: `Input ${input.id || input.name} is missing a label`
      });
    }
    
    if (input.required && !input.getAttribute('aria-required')) {
      input.setAttribute('aria-required', 'true');
    }
  });
  
  return result;
}

/**
 * Handles skip link functionality
 */
function initSkipLink() {
  const skipLink = document.querySelector('[href^="#"]');
  
  if (skipLink) {
    skipLink.addEventListener('click', (event) => {
      const targetId = skipLink.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      
      if (target) {
        event.preventDefault();
        target.tabIndex = -1;
        target.focus();
        target.scrollIntoView();
      }
    });
  }
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    manageFocus,
    handleKeyboardNavigation,
    setAriaAttributes,
    announceToScreenReader,
    trapFocus,
    removeFocusTrap,
    validateFormAccessibility,
    initSkipLink
  };
}