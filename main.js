// Main entry point for the application
const { Button } = require('./Button');
const { Link } = require('./Link');

// ... existing code continues ...

/**
 * Creates an in-page button element.
 * @param {string} text - The button text
 * @param {Object} [options] - Optional configuration options
 * @returns {HTMLElement} The created button element
 */
function createInPageButton(text, options = {}) {
  const btn = document.createElement('button');
  btn.textContent = text;
  // Apply any additional styling or classes from options
  Object.assign(btn.style, options);
  return btn;
}

/**
 * Creates an accessible link element with proper ARIA attributes.
 * @param {string} href - The URL target
 * @param {string} label - The link text
 * @param {Object} [options] - Accessibility options (e.g., aria-label)
 * @returns {HTMLElement} The created anchor element
 */
function createAccessibleLink(href, label, options = {}) {
  const a = document.createElement('a');
  a.href = href;
  a.textContent = label;
  
  // Ensure accessibility compliance
  if (options.ariaLabel) {
    a.setAttribute('aria-label', options.ariaLabel);
  }
  
  return a;
}

module.exports = {
  // Existing exports are preserved here
  Button,
  Link,
  // ... other existing exports ...
};