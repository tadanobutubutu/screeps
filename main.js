/**
 * Creates an in-page button element
 * @param {string} text - Button label text
 * @param {Function} onClick - Click handler function
 * @param {Object} options - Optional configuration
 * @param {string} options.id - Button ID attribute
 * @param {string} options.className - Additional CSS class names
 * @param {string} options.title - Button title/tooltip
 * @param {HTMLElement} options.container - Container to append button to
 * @returns {HTMLButtonElement} The created button element
 */
function createInPageButton(text, onClick, options = {}) {
  const button = document.createElement('button');
  button.textContent = text;
  button.className = `in-page-button ${options.className || ''}`.trim();
  
  if (options.id) {
    button.id = options.id;
  }
  
  if (options.title) {
    button.title = options.title;
  }
  
  if (typeof onClick === 'function') {
    button.addEventListener('click', onClick);
  }
  
  if (options.container instanceof HTMLElement) {
    options.container.appendChild(button);
  }
  
  return button;
}