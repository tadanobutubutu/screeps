const getAccessibleName = (node) => {
  const { svg, title, text } = node;

  let accessibleName = 'unknown';

  if (svg && svg.nodeName.toLowerCase() === 'svg') {
    // Try aria-label first, then fallback to title or text
    if (svg.hasAttribute('aria-label')) {
      accessibleName = svg.getAttribute('aria-label');
    } else {
      accessibleName = title || text;
    }
  }

  return accessibleName;
};

// Existing exports and functions continue to be preserved
// No changes to exports are allowed