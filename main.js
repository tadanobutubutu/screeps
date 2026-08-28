// // TODO: Implement createInPageButton() and createAccessibleLink() functions here

/**
 * Creates an accessible link element
 * @param {string} text - The text content of the link
 * @param {string} href - The URL the link points to
 * @param {Object} options - Additional options for the link
 * @returns {HTMLAnchorElement} The created link element
 */
function createAccessibleLink(text, href, options = {}) {
  const link = document.createElement('a');
  link.textContent = text;
  link.href = href;
  
  if (options.className) {
    link.className = options.className;
  }
  if (options.id) {
    link.id = options.id;
  }
  if (options.target) {
    link.target = options.target;
  }
  if (options.rel) {
    link.rel = options.rel;
  }
  if (options.title) {
    link.title = options.title;
  }
  if (options.onClick) {
    link.addEventListener('click', options.onClick);
  }
  
  // Ensure accessibility attributes
  link.setAttribute('role', 'link');
  link.setAttribute('tabindex', '0');
  
  return link;
}

/**
 * Creates an in-page button element
 * @param {string} text - The text content of the button
 * @param {Object} options - Additional options for the button
 * @returns {HTMLButtonElement} The created button element
 */
function createInPageButton(text, options = {}) {
  const button = document.createElement('button');
  button.textContent = text;
  
  if (options.className) {
    button.className = options.className;
  }
  if (options.id) {
    button.id = options.id;
  }
  if (options.type) {
    button.type = options.type;
  } else {
    button.type = 'button';
  }
  if (options.disabled) {
    button.disabled = options.disabled;
  }
  if (options.title) {
    button.title = options.title;
  }
  if (options.onClick) {
    button.addEventListener('click', options.onClick);
  }
  
  return button;
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createInPageButton, createAccessibleLink };
}