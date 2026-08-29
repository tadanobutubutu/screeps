// main.js
// Accessibility utilities for the application

/**
 * Adds an ARIA label to an element for screen reader support.
 * @param {HTMLElement} element - The element requiring an accessible label
 */
function addAccessibleLabel(element) {
  const label = document.createElement('span');
  label.setAttribute('aria-label', 'Descriptive label for the element');
  element.parentNode.insertBefore(label, element);
}

/**
 * Ensures focus moves to the next interactive element when navigating through the page.
 * @param {HTMLElement} target - The currently focused element
 */
function focusNextInteractive(target) {
  const nextElement = target.nextElementSibling;
  if (nextElement && typeof nextElement.addEventListener === 'function') {
    nextElement.addEventListener('blur', () => {
      setTimeout(() => {
        if (nextElement.matches('button, [href], input, select, textarea')) {
          nextElement.focus();
        }
      }, 100);
    });
  }
}

// TODO: Address accessibility issues from insight report — CONTINUING
// Add new functions (no existing functions should be removed or renamed)

/**
 * Creates a semantically correct button element with proper ARIA attributes.
 * @param {string} id - Unique identifier for the button
 * @param {string} text - Button text
 * @returns {HTMLElement} The created button element
 */
function createAccessibleButton(id, text) {
  const button = document.createElement('button');
  button.id = id;
  button.textContent = text;
  button.setAttribute('type', 'button');
  return button;
}

/**
 * Applies focus indicator styles to an element for keyboard navigation visibility.
 * @param {HTMLElement} element - The element needing improved focus styling
 */
function applyFocusIndicator(element) {
  element.style.outline = '2px solid #005fcc';
  element.style.outlineOffset = '2px';
}

// Export existing functionality (unchanged)
export { /* existing exports */ };

// Example usage of new accessibility functions
// These can be called from other parts of the application
const accessibleBtn = createAccessibleButton('submit-btn', 'Submit Form');
applyFocusIndicator(accessibleBtn);

module.exports = {
  addAccessibleLabel,
  focusNextInteractive,
  createAccessibleButton,
  applyFocusIndicator
};