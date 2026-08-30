// main.js

// Utility functions

/**
 * Creates a button element for in-page use.
 * @param {string} text - The text/label for the button
 * @param {Function} onClick - Click handler callback
 * @param {Object} options - Optional configuration
 * @param {string} [options.className] - CSS class(es) to apply
 * @param {string} [options.id] - Element ID
 * @param {Object} [options.styles] - Inline styles to apply
 * @param {string} [options.type] - Button type (default: 'button')
 * @param {boolean} [options.accessible] - Flag to indicate if the button should have accessibility features
 * @returns {HTMLButtonElement} The created button element
 */
function createInPageButton(text, onClick, options = {}) {
  const {
    className = '',
    id = '',
    styles = {},
    type = 'button',
    disabled = false,
    accessible = false,
  } = options;

  const button = document.createElement('button');
  button.type = type;
  button.textContent = text;
  button.disabled = disabled;

  if (className) {
    button.className = className;
  }

  if (id) {
    button.id = id;
  }

  if (styles && typeof styles === 'object') {
    Object.assign(button.style, styles);
  }

  // Add accessibility features if requested
  if (accessible) {
    button.setAttribute('role', 'button');
    button.setAttribute('tabindex', '0');
    button.setAttribute('aria-pressed', 'false');
  }

  if (typeof onClick === 'function') {
    button.addEventListener('click', onClick);
  }

  return button;
}

// Export for module usage and testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    createInPageButton,
  };
}