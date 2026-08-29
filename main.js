// TODO: Address accessibility issues from insight report:

/**
 * Adds an ARIA label to an element if not already present.
 * @param {HTMLElement} element - The target element.
 * @param {string} label - The accessible label to set.
 */
function addAriaLabel(element, label) {
  if (element && !element.getAttribute('aria-label')) {
    element.setAttribute('aria-label', label);
  }
}

/**
 * Ensures an element has an appropriate ARIA role.
 * @param {HTMLElement} element - The target element.
 * @param {string} role - The ARIA role to set.
 */
function addAriaRole(element, role) {
  if (element && !element.getAttribute('role')) {
    element.setAttribute('role', role);
  }
}

/**
 * Adds keyboard support for custom interactive elements.
 * @param {HTMLElement} element - The target element.
 */
function addKeyboardSupport(element) {
  if (element) {
    element.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        element.click();
      }
    });
  }
}

export { addAriaLabel, addAriaRole, addKeyboardSupport };