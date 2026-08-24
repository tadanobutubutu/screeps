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

  // Assuming your library or framework has a method `setAttribute` to set attributes
  if (!node) {
    return;
  }

  // Try to set aria-label directly on node if it supports setAttribute
  if (typeof node.setAttribute === 'function') {
    node.setAttribute('aria-label', accessibleName);
    return; // Set on the node itself and exit
  }

  // Fallback: try to set on the SVG element if available
  if (node.svg && typeof node.svg.setAttribute === 'function') {
    node.svg.setAttribute('aria-label', accessibleName);
  }

  // Set title element textContent and fallback aria-label element
  if (typeof node.querySelector === 'function') {
    const titleEl = node.querySelector('title');
    if (titleEl) {
      titleEl.textContent = accessibleName;
    }

    const ariaLabelEl = node.querySelector('[aria-label]');
    if (ariaLabelEl && typeof ariaLabelEl.setAttribute === 'function') {
      ariaLabelEl.setAttribute('aria-label', accessibleName);
    }
  }
};

// Existing exports and functions continue to be preserved
// No changes to exports are allowed

module.exports = { getAccessibleName, setAccessibleName };