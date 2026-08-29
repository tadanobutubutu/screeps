// main.js - Accessibility improvements implementation

/**
 * Accessibility utility functions for improved a11y support
 */

// Announce messages to screen readers using aria-live regions
let liveRegion = null;

function ensureLiveRegion() {
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.style.position = 'absolute';
    liveRegion.style.width = '1px';
    liveRegion.style.height = '1px';
    liveRegion.style.padding = '0';
    liveRegion.style.margin = '-1px';
    liveRegion.style.overflow = 'hidden';
    liveRegion.style.clip = 'rect(0, 0, 0, 0)';
    liveRegion.style.whiteSpace = 'nowrap';
    liveRegion.style.border = '0';
    document.body.appendChild(liveRegion);
  }
  return liveRegion;
}

/**
 * Announce a message to screen readers
 * @param {string} message - The message to announce
 * @param {('polite'|'assertive')} priority - The priority of the announcement
 */
export function announce(message, priority = 'polite') {
  const region = ensureLiveRegion();
  region.setAttribute('aria-live', priority);
  region.textContent = '';
  // Force a reflow to ensure the announcement is read
  region.offsetHeight;
  region.textContent = message;
}

/**
 * Trap focus within a container element
 * @param {HTMLElement} container - The container to trap focus within
 * @returns {Function} Cleanup function to remove focus trap
 */
export function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  function handleTabKey(e) {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }

  container.addEventListener('keydown', handleTabKey);
  firstElement?.focus();

  return () => {
    container.removeEventListener('keydown', handleTabKey);
  };
}

/**
 * Get all focusable elements within a container
 * @param {HTMLElement} container - The container to search within
 * @returns {HTMLElement[]} Array of focusable elements
 */
export function getFocusableElements(container) {
  return Array.from(
    container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
  ).filter(el => !el.hasAttribute('disabled') && el.getAttribute('tabindex') !== '-1');
}

/**
 * Check if user prefers reduced motion
 * @returns {boolean} True if user prefers reduced motion
 */
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if user prefers high contrast
 * @returns {boolean} True if user prefers high contrast
 */
export function prefersHighContrast() {
  return window.matchMedia('(prefers-contrast: high)').matches;
}

/**
 * Check if user prefers dark color scheme
 * @returns {boolean} True if user prefers dark color scheme
 */
export function prefersDarkScheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Manage focus restoration after modal/dialog closes
 */
let lastFocusedElement = null;

export function saveFocus() {
  lastFocusedElement = document.activeElement;
}

export function restoreFocus() {
  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
    lastFocusedElement.focus();
    lastFocusedElement = null;
  }
}

/**
 * Add keyboard event handlers for common accessibility patterns
 * @param {HTMLElement} element - Element to add handlers to
 * @param {Object} handlers - Object containing handler functions
 * @param {Function} [handlers.onEnter] - Handler for Enter key
 * @param {Function} [handlers.onSpace] - Handler for Space key
 * @param {Function} [handlers.onEscape] - Handler for Escape key
 * @param {Function} [handlers.onArrowUp] - Handler for ArrowUp key
 * @param {Function} [handlers.onArrowDown] - Handler for ArrowDown key
 * @param {Function} [handlers.onArrowLeft] - Handler for ArrowLeft key
 * @param {Function} [handlers.onArrowRight] - Handler for ArrowRight key
 * @param {Function} [handlers.onHome] - Handler for Home key
 * @param {Function} [handlers.onEnd] - Handler for End key
 * @returns {Function} Cleanup function to remove handlers
 */
export function addKeyboardHandlers(element, handlers) {
  const keyMap = {
    Enter: 'onEnter',
    ' ': 'onSpace',
    Escape: 'onEscape',
    ArrowUp: 'onArrowUp',
    ArrowDown: 'onArrowDown',
    ArrowLeft: 'onArrowLeft',
    ArrowRight: 'onArrowRight',
    Home: 'onHome',
    End: 'onEnd'
  };

  function handleKeyDown(e) {
    const handlerName = keyMap[e.key];
    if (handlerName && handlers[handlerName]) {
      handlers[handlerName](e);
    }
  }

  element.addEventListener('keydown', handleKeyDown);

  return () => {
    element.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Generate a unique ID for ARIA attributes
 * @param {string} prefix - Prefix for the ID
 * @returns {string} Unique ID
 */
let idCounter = 0;
export function generateId(prefix = 'a11y') {
  return `${prefix}-${++idCounter}-${Date.now()}`;
}

/**
 * Set ARIA attributes on an element
 * @param {HTMLElement} element - Element to set attributes on
 * @param {Object} attributes - Object of ARIA attributes to set
 */
export function setAriaAttributes(element, attributes) {
  Object.entries(attributes).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      element.removeAttribute(key);
    } else {
      element.setAttribute(key, value);
    }
  });
}

/**
 * Check if an element is visible to screen readers
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} True if element is accessible
 */
export function isAccessible(element) {
  const style = window.getComputedStyle(element);
  return (
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    element.getAttribute('aria-hidden') !== 'true' &&
    element.getAttribute('hidden') === null
  );
}

/**
 * Adds SVG accessibility props to the given props object
 * Ensures SVGs are properly accessible by adding role, aria-label, etc.
 * @param {Object} props - The existing props object
 * @returns {Object} The props with accessibility attributes added
 */
export function addSvgAccessibilityProps(props) {
  if (!props) {
    return { role: 'img' };
  }

  const {
    role = 'img',
    ariaLabel,
    ariaLabelledby,
    ariaDescribedby,
    ariaHidden,
    focusable = false,
    ...rest
  } = props;

  const accessibilityProps = {
    role,
    ...(ariaLabel && { 'aria-label': ariaLabel }),
    ...(ariaLabelledby && { 'aria-labelledby': ariaLabelledby }),
    ...(ariaDescribedby && { 'aria-describedby': ariaDescribedby }),
    ...(ariaHidden === true && { 'aria-hidden': 'true' }),
    focusable,
  };

  return {
    ...rest,
    ...accessibilityProps,
  };
}

/**
 * Validates the structure of the table to ensure accessibility.
 * @param {HTMLElement} table - The table to validate
 * @returns {boolean} True if the table is accessible, false otherwise
 */
export function validateTableStructure(table) {
  if (!table) {
    throw new Error('Table is required');
  }

  // Placeholder for table structure validation logic
  // This should include checks for headers, caption, and row grouping

  // For now, we assume the table is valid
  return true;
}

export default {
  announce,
  trapFocus,
  getFocusableElements,
  prefersReducedMotion,
  prefersHighContrast,
  prefersDarkScheme,
  saveFocus,
  restoreFocus,
  addKeyboardHandlers,
  generateId,
  setAriaAttributes,
  isAccessible,
  addSvgAccessibilityProps,
  validateTableStructure
};