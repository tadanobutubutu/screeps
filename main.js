// TODO: This is the existing code that needs to be preserved

const getAccessibleName = (node) => {
  const { svg, title, text } = node;

  let accessibleName = 'unknown';

  if (svg && svg.tagName === 'svg') {
    // Try aria-label first, then fallback to title or text
    const ariaLabel = svg.getAttribute ? svg.getAttribute('aria-label') : null;
    if (ariaLabel) {
      accessibleName = ariaLabel;
    } else {
      accessibleName = title || text;
    }
  }

  return accessibleName;
};

// New function requested in issue description
const setAccessibleName = (node, accessibleName) => {
  // Implementation details for setting the accessible name
  // You may need to use appropriate methods or attributes to set the accessible name based on the DOM library or framework being used.

  if (!node) {
    return;
  }

  // If the node has a setAttribute method (e.g., a DOM element), set aria-label directly.
  if (typeof node.setAttribute === 'function') {
    node.setAttribute('aria-label', accessibleName);
    return;
  }

  // Fallback: look for a <title> element inside the node and update its text.
  if (node.querySelector) {
    const titleEl = node.querySelector('title');
    if (titleEl) {
      titleEl.textContent = accessibleName;
    }

    // Also try to set aria-label on any element that already has it, if we want to override.
    const ariaLabelEl = node.querySelector('[aria-label]');
    if (ariaLabelEl && typeof ariaLabelEl.setAttribute === 'function') {
      ariaLabelEl.setAttribute('aria-label', accessibleName);
    }
  }
};

// Existing exports and functions continue to be preserved
// No changes to exports are allowed

module.exports = { getAccessibleName, setAccessibleName };