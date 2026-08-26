// TODO: This is the existing code that needs to be preserved

const getAccessibleName = (node) => {
  const { svg, title, text } = node;

  let accessibleName = 'unknown';

  if (svg && svg.tagName === 'svg') {
    // Try aria-labelledby first, then aria-label, then title, then text
    if (svg.getAttribute('aria-labelledby')) {
      accessibleName = svg.getAttribute('aria-labelledby');
    } else if (svg.getAttribute('aria-label')) {
      accessibleName = svg.getAttribute('aria-label');
    } else if (title && title.textContent) {
      accessibleName = title.textContent;
    } else {
      accessibleName = text || 'unknown';
    }
  }

  return accessibleName;
};

const setAccessibleName = (node, accessibleName) => {
  const { svg } = node;

  if (svg && svg.tagName === 'svg') {
    // Set accessible name following proper accessibility priority
    // 1. Prefer aria-label for inline SVGs
    if (accessibleName && typeof accessibleName === 'string') {
      svg.setAttribute('aria-label', accessibleName);
    }
  }
};

// Existing exports and functions continue to be preserved
// No changes to exports are allowed

module.exports = { getAccessibleName, setAccessibleName };