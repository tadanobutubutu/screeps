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

// New function to add accessible name to SVG elements
const addAccessibleNameToSVG = (svgElement, accessibleName) => {
  if (!svgElement) return;

  // Set aria-label to provide an accessible name
  setAccessibleName(svgElement, accessibleName);

  // If the SVG is decorative, hide it
  if (!svgElement.querySelector('title') && !svgElement.querySelector('text') && !svgElement.querySelector('image')) {
    svgElement.setAttribute('aria-hidden', 'true');
  }
};

// Existing exports and functions continue to be preserved
// No changes to exports are allowed

module.exports = { getAccessibleName, setAccessibleName, addAccessibleNameToSVG };