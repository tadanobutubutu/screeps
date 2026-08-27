// main.js - Entry point for the extension

// TODO: Implement createInPageButton functionality

/**
 * Creates an in-page button element and appends it to the specified container
 * @param {Object} options - Configuration options for the button
 * @param {string} [options.text='Click Me'] - Button text content
 * @param {string} [options.id] - Button ID attribute
 * @param {string} [options.className='in-page-button'] - CSS class name(s)
 * @param {string} [options.style] - Inline CSS styles
 * @param {Function} [options.onClick] - Click event handler
 * @param {HTMLElement} [options.container=document.body] - Container to append button to
 * @returns {HTMLButtonElement} The created button element
 */
function createInPageButton(options = {}) {
  const button = document.createElement('button');
  
  button.textContent = options.text || 'Click Me';
  button.id = options.id || '';
  button.className = options.className || 'in-page-button';
  
  if (options.style) {
    button.style.cssText = options.style;
  }
  
  if (typeof options.onClick === 'function') {
    button.addEventListener('click', options.onClick);
  }
  
  const container = options.container || document.body;
  container.appendChild(button);
  
  return button;
}

// Example usage and initialization
document.addEventListener('DOMContentLoaded', () => {
  console.log('Extension loaded');
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createInPageButton };
}