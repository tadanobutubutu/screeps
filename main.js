// TODO: Address accessibility issues from insight report:

// Accessibility utility functions

/**
 * Ensures all interactive elements have accessible names
 * @param {HTMLElement} element - The element to check
 * @returns {boolean} - Whether the element is accessible
 */
function hasAccessibleName(element) {
  if (!element) return false;
  const hasText = element.textContent.trim().length > 0;
  const hasAriaLabel = element.getAttribute('aria-label');
  const hasAriaLabelledby = element.getAttribute('aria-labelledby');
  const hasTitle = element.getAttribute('title');
  return hasText || hasAriaLabel || hasAriaLabelledby || hasTitle;
}

/**
 * Validates that form inputs have associated labels
 * @param {HTMLFormElement} form - The form to validate
 * @returns {Object} - Validation result with accessible inputs
 */
function validateFormAccessibility(form) {
  if (!form) return { valid: false, inputs: [] };
  const inputs = form.querySelectorAll('input, select, textarea');
  const results = Array.from(inputs).map(input => ({
    element: input,
    hasLabel: !!document.querySelector(`label[for="${input.id}"]`) || 
              input.closest('label') ||
              input.getAttribute('aria-label') ||
              input.getAttribute('aria-labelledby'),
    id: input.id || null
  }));
  return {
    valid: results.every(r => r.hasLabel || !r.id),
    inputs: results
  };
}

/**
 * Ensures buttons have accessible names or roles
 * @param {HTMLElement} container - Container to search
 * @returns {HTMLElement[]} - Buttons missing accessible names
 */
function findInaccessibleButtons(container = document) {
  const buttons = container.querySelectorAll('button, [role="button"]');
  return Array.from(buttons).filter(btn => !hasAccessibleName(btn));
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { hasAccessibleName, validateFormAccessibility, findInaccessibleButtons };
}