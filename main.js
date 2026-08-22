// TODO: Add back any required exports that might have been?

/**
 * Adds two numbers together
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Sum of a and b
 */
function add(a, b) {
  return a + b;
}

/**
 * Subtracts b from a
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Difference of a and b
 */
function subtract(a, b) {
  return a - b;
}

/**
 * Multiplies two numbers together
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Product of a and b
 */
function multiply(a, b) {
  return a * b;
}

/**
 * Divides a by b
 * @param {number} a - Dividend
 * @param {number} b - Divisor
 * @returns {number} Quotient of a and b
 */
function divide(a, b) {
  if (b === 0) {
    throw new Error('Division by zero');
  }
  return a / b;
}

// Accessibility utility functions

/**
 * Announces a message to screen readers using an ARIA live region
 * @param {string} message - The message to announce
 * @param {string} [priority='polite'] - 'polite' or 'assertive'
 */
function announceToScreenReader(message, priority = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.setAttribute('class', 'sr-only');
  announcement.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Traps focus within an element (useful for modals)
 * @param {HTMLElement} element - The element to trap focus within
 */
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  function handleTabKey(e) {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  }

  element.addEventListener('keydown', handleTabKey);
  return handleTabKey;
}

/**
 * Releases focus trap
 * @param {HTMLElement} element - The element with the trapped focus
 * @param {Function} handler - The handler function returned by trapFocus
 */
function releaseFocus(element, handler) {
  element.removeEventListener('keydown', handler);
}

/**
 * Sets focus to the first focusable element in a container
 * @param {HTMLElement} container - The container element
 */
function setFocusToFirstFocusable(container) {
  const focusableElements = container.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  if (focusableElements.length > 0) {
    focusableElements[0].focus();
  }
}

// Export all functions
module.exports = {
  add,
  subtract,
  multiply,
  divide,
  announceToScreenReader,
  trapFocus,
  releaseFocus,
  setFocusToFirstFocusable
};

// Add aria-label to SVGs in app/layout.tsx and dashboard/app/layout.tsx
const updateFaviconSVG = (icon) => {
  return icon.replace(/<svg xmlns="http:\/\/www.w3.org\/2000\/svg".*?>/g, (svg) => {
    return svg.replace(/<title>(.*?)<\/title>/, '<title>Screeps Dashboard</title>').replace(/<text.*?>(.*?)<\/text>/, '<title>Screeps Dashboard</title>');
  });
};

// Update icons with accessible SVG
module.exports = {
  add,
  subtract,
  multiply,
  divide,
  announceToScreenReader,
  trapFocus,
  releaseFocus,
  setFocusToFirstFocusable,
  updateFaviconSVG
};