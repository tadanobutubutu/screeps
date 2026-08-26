// main.js

// TODO: Address accessibility issues from insight report — FIXED (combined with the export code)

/**
 * Accessible utility functions
 * Addressing accessibility issues from insight report
 */

// ARIA live region announcer for accessibility
const createAnnouncer = () => {
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  announcer.className = 'sr-only';
  announcer.style.position = 'absolute';
  announcer.style.width = '1px';
  announcer.style.height = '1px';
  announcer.style.padding = '0';
  announcer.style.margin = '-1px';
  announcer.style.overflow = 'hidden';
  announcer.style.clip = 'rect(0, 0, 0, 0)';
  announcer.style.whiteSpace = 'nowrap';
  announcer.style.border = '0';
  document.body.appendChild(announcer);
  return announcer;
};

const announcer = createAnnouncer();

/**
 * Announces a message to screen readers
 * @param {string} message - The message to announce
 * @param {string} priority - 'polite' or 'assertive'
 */
export function announceToScreenReader(message, priority = 'polite') {
  announcer.setAttribute('aria-live', priority);
  announcer.textContent = '';
  setTimeout(() => {
    announcer.textContent = message;
  }, 100);
}

/**
 * Focuses an element with proper keyboard support
 * @param {HTMLElement} element - The element to focus
 */
export function focusElement(element) {
  if (element && typeof element.focus === 'function') {
    element.setAttribute('tabindex', '-1');
    element.focus();
  }
}

/**
 * Traps focus within a container for modal dialogs
 * @param {HTMLElement} container - The container to trap focus within
 */
export function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };

  container.addEventListener('keydown', handleKeyDown);
  return () => container.removeEventListener('keydown', handleKeyDown);
}

/**
 * Exports data to a downloadable file
 * @param {Object} data - The data to export
 * @param {string} filename - The filename for the export
 * @param {string} format - The export format ('json', 'csv', 'txt')
 */
export function exportData(data, filename = 'export', format = 'json') {
  let content, mimeType, extension;

  switch (format) {
    case 'json':
      content = JSON.stringify(data, null, 2);
      mimeType = 'application/json';
      extension = 'json';
      break;
    case 'csv':
      if (Array.isArray(data) && data.length > 0) {
        const headers = Object.keys(data[0]);
        const rows = data.map(item =>
          headers.map(h => `"${String(item[h]).replace(/"/g, '""')}"`).join(',')
        );
        content = [headers.join(','), ...rows].join('\n');
      } else {
        content = '';
      }
      mimeType = 'text/csv';
      extension = 'csv';
      break;
    case 'txt':
    default:
      content = typeof data === 'object' ? JSON.stringify(data) : String(data);
      mimeType = 'text/plain';
      extension = 'txt';
  }

  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.${extension}`;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  announceToScreenReader(`Exported ${filename} as ${format.toUpperCase()} file`, 'polite');
}

/**
 * Handles keyboard navigation for custom components
 * @param {KeyboardEvent} event - The keyboard event
 * @param {Function} callbacks - Object containing callback functions for navigation
 */
export function handleKeyboardNavigation(event, callbacks = {}) {
  const { onUp, onDown, onLeft, onRight, onEnter, onEscape, onHome, onEnd } = callbacks;
  const keyHandlers = {
    ArrowUp: onUp,
    ArrowDown: onDown,
    ArrowLeft: onLeft,
    ArrowRight: onRight,
    Enter: onEnter,
    Escape: onEscape,
    Home: onHome,
    End: onEnd
  };

  if (keyHandlers[event.key]) {
    event.preventDefault();
    keyHandlers[event.key]();
  }
}

/**
 * Reduces motion for users who prefer reduced motion
 * @returns {boolean} Whether reduced motion is preferred
 */
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Applies reduced motion preference to an animation
 * @param {Element} element - The element to animate
 * @param {Object} animation - The animation object
 * @returns {Object} The potentially modified animation
 */
export function applyReducedMotion(element, animation) {
  if (prefersReducedMotion()) {
    element.style.transition = 'none';
    return { ...animation, duration: 0 };
  }
  return animation;
}

// Initialize accessibility features
export function initializeAccessibility() {
  document.body.classList.add('accessibility-ready');
  
  // Skip link functionality
  const skipLink = document.querySelector('[data-skip-link]');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(skipLink.getAttribute('href') || '#main-content');
      if (target) {
        focusElement(target);
      }
    });
  }
}

// Default export with all functionality
export default {
  announceToScreenReader,
  focusElement,
  trapFocus,
  exportData,
  handleKeyboardNavigation,
  prefersReducedMotion,
  applyReducedMotion,
  initializeAccessibility
};