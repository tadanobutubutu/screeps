// // TODO: Implement createInPageButton() and createAccessibleLink() functions here

/**
 * Creates an accessible in-page button element.
 * @param {string} text - The button text content
 * @param {Function} onClick - Click event handler
 * @param {Object} options - Additional options
 * @param {string} options.id - Button ID
 * @param {string} options.className - Button CSS class
 * @param {string} options.ariaLabel - Accessible label for screen readers
 * @param {boolean} options.disabled - Whether button is disabled
 * @returns {HTMLButtonElement} The created button element
 */
function createInPageButton(text, onClick, options = {}) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = text;
  
  if (options.id) button.id = options.id;
  if (options.className) button.className = options.className;
  if (options.disabled) button.disabled = options.disabled;
  if (options.ariaLabel) button.setAttribute('aria-label', options.ariaLabel);
  
  if (typeof onClick === 'function') {
    button.addEventListener('click', onClick);
  }
  
  return button;
}

/**
 * Creates an accessible link element.
 * @param {string} href - The URL the link points to
 * @param {string} text - The link text content
 * @param {Object} options - Additional options
 * @param {string} options.id - Link ID
 * @param {string} options.className - Link CSS class
 * @param {string} options.ariaLabel - Accessible label for screen readers
 * @param {string} options.target - Link target attribute (_blank, _self, etc.)
 * @returns {HTMLAnchorElement} The created anchor element
 */
function createAccessibleLink(href, text, options = {}) {
  const link = document.createElement('a');
  link.href = href;
  link.textContent = text;
  
  if (options.id) link.id = options.id;
  if (options.className) link.className = options.className;
  if (options.ariaLabel) link.setAttribute('aria-label', options.ariaLabel);
  if (options.target) link.target = options.target;
  
  return link;
}

module.exports = {
  createInPageButton,
  createAccessibleLink
};