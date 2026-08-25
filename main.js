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
  if (node && node.svg && node.svg.setAttribute) {
    node.svg.setAttribute('aria-label', accessibleName);
  }

  // Additional fallback if needed (replace with your library's method)
  if (node && node.querySelector) {
    const titleEl = node.querySelector('title');
    if (titleEl) {
      titleEl.textContent = accessibleName;
    }
  }

  // Added function to find and update role="img" and Alt attribute
  if (node && node.querySelectorAll && node.querySelectorAll('[role="img"]').length) {
    node.querySelectorAll('[role="img"]').forEach(img => {
      img.setAttribute('alt', accessibleName);
    });
  }
};

// Existing exports and functions continue to be preserved
// No changes to exports are allowed

module.exports = { getAccessibleName, setAccessibleName };