// TODO: Address accessibility issues from insight report:

const getAccessibleName = (node) => {
  const { svg, title, text } = node;

  let accessibleName = 'unknown';

  if (svg && svg.tagName === 'svg') {
    // Try aria-label first, then fallback to title or text
    if (svg.getAttribute && svg.getAttribute('aria-label')) {
      accessibleName = svg.getAttribute('aria-label');
    } else if (svg.getAttribute && svg.getAttribute('aria-labelledby')) {
      accessibleName = svg.getAttribute('aria-labelledby');
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
};

// Existing exports and functions continue to be preserved
// No changes to exports are allowed

module.exports = { getAccessibleName, setAccessibleName };