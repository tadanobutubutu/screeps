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

// Add the new function to fix the REACT_027 issue
const fixTableHeaders = (table) => {
  const headers = table.querySelectorAll('th');
  headers.forEach(header => {
    if (!header.hasAttribute('scope')) {
      header.setAttribute('scope', 'col');
    }
  });
};

module.exports = { getAccessibleName, setAccessibleName, fixTableHeaders };