// TODO: Address accessibility issues from insight report:

/**
 * Accessibility utilities for improving keyboard navigation and screen reader support
 */

// Track currently focused element for restoration
let previousActiveElement = null;

/**
 * Manage focus for modal dialogs and overlays
 * @param {HTMLElement} element - The element to focus
 * @param {HTMLElement} previousElement - Element to restore focus to on close
 */
function manageFocus(element, previousElement = null) {
  if (previousElement) {
    previousActiveElement = previousElement;
  }
  
  if (element && element.focus) {
    element.setAttribute('tabindex', '-1');
    element.focus();
  }
}

/**
 * Trap focus within a container element (for modals)
 * @param {HTMLElement} container - The container to trap focus within
 */
function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  container.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  });
}

/**
 * Announce message to screen readers
 * @param {string} message - The message to announce
 * @param {string} politeness - 'polite' or 'assertive'
 */
function announceToScreenReader(message, politeness = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', politeness);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Add keyboard navigation support for custom components
 * @param {string} selector - Selector for the container
 * @param {Object} options - Configuration options
 */
function setupKeyboardNavigation(selector, options = {}) {
  const container = document.querySelector(selector);
  if (!container) return;
  
  const {
    orientation = 'both', // 'horizontal', 'vertical', 'both'
    wrap = true
  } = options;
  
  container.addEventListener('keydown', (e) => {
    const items = container.querySelectorAll('[role="option"], [role="menuitem"], li, button');
    const currentIndex = Array.from(items).indexOf(document.activeElement);
    
    if (currentIndex === -1) return;
    
    let nextIndex = currentIndex;
    const key = e.key;
    
    if ((orientation === 'horizontal' || orientation === 'both') && (key === 'ArrowRight' || key === 'ArrowLeft')) {
      e.preventDefault();
      nextIndex = key === 'ArrowRight' ? currentIndex + 1 : currentIndex - 1;
    } else if ((orientation === 'vertical' || orientation === 'both') && (key === 'ArrowDown' || key === 'ArrowUp')) {
      e.preventDefault();
      nextIndex = key === 'ArrowDown' ? currentIndex + 1 : currentIndex - 1;
    } else if (key === 'Home') {
      e.preventDefault();
      nextIndex = 0;
    } else if (key === 'End') {
      e.preventDefault();
      nextIndex = items.length - 1;
    }
    
    // Handle wrapping
    if (wrap) {
      if (nextIndex < 0) nextIndex = items.length - 1;
      if (nextIndex >= items.length) nextIndex = 0;
    } else {
      nextIndex = Math.max(0, Math.min(nextIndex, items.length - 1));
    }
    
    if (items[nextIndex]) {
      items[nextIndex].focus();
    }
  });
}

/**
 * Create accessible button with proper semantics
 * @param {Object} options - Button options
 * @returns {HTMLButtonElement}
 */
function createAccessibleButton(options) {
  const {
    text,
    onClick,
    disabled = false,
    ariaLabel,
    ariaDescribedBy,
    className = ''
  } = options;
  
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = text;
  button.className = className;
  button.disabled = disabled;
  
  if (ariaLabel) {
    button.setAttribute('aria-label', ariaLabel);
  }
  
  if (ariaDescribedBy) {
    button.setAttribute('aria-describedby', ariaDescribedBy);
  }
  
  if (disabled) {
    button.setAttribute('aria-disabled', 'true');
  }
  
  if (onClick) {
    button.addEventListener('click', onClick);
  }
  
  return button;
}

/**
 * Initialize skip link functionality
 */
function initSkipLink() {
  const skipLink = document.querySelector('[href="#main-content"]');
  if (skipLink) {
    const target = document.querySelector(skipLink.getAttribute('href'));
    if (target) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        target.setAttribute('tabindex', '-1');
        target.focus();
        target.removeAttribute('tabindex');
      });
    }
  }
}

/**
 * Check color contrast ratio
 * @param {string} fgColor - Foreground color (hex)
 * @param {string} bgColor - Background color (hex)
 * @returns {boolean} True if contrast meets WCAG AA standards
 */
function meetsContrastRequirements(fgColor, bgColor) {
  const getLuminance = (color) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    
    const rs = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
    const gs = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
    const bs = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
    
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };
  
  const l1 = getLuminance(fgColor);
  const l2 = getLuminance(bgColor);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  const ratio = (lighter + 0.05) / (darker + 0.05);
  return ratio >= 4.5; // WCAG AA requires 4.5:1 for normal text
}

// Initialize accessibility features on DOM ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    initSkipLink();
  });
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    manageFocus,
    trapFocus,
    announceToScreenReader,
    setupKeyboardNavigation,
    createAccessibleButton,
    initSkipLink,
    meetsContrastRequirements
  };
}