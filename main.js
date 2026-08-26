// TODO: This is the existing code that needs to be preserved

const getAccessibleName = (node) => {
  const { svg, title, text } = node;

  let accessibleName = 'unknown';

  if (svg && svg.tagName === 'svg') {
    // Try aria-label first, then fallback to title or text
    if (svg.getAttribute('aria-label')) {
      accessibleName = svg.getAttribute('aria-label');
    } else {
      accessibleName = title || text;
    }
  }

  return accessibleName;
};

const setAccessibleName = (node, accessibleName) => {
  // Implementation details for setting the accessible name
  // Assuming your library or framework has a method `setAttribute` to set attributes
  node.setAttribute('aria-label', accessibleName);
};

// Existing exports and functions continue to be preserved
// No changes to exports are allowed

// New function added based on the issue requirement
const updateAccessibleName = (node, newAccessibleName) => {
  const currentAccessibleName = getAccessibleName(node);
  if (currentAccessibleName !== newAccessibleName) {
    setAccessibleName(node, newAccessibleName);
  }
};

module.exports = { getAccessibleName, setAccessibleName, updateAccessibleName };