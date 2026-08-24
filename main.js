const getAccessibleName = (node) => {
  const { svg, title, text } = node;

  let accessibleName = 'unknown';

  if (svg && svg.nodeName.toLowerCase() === 'svg') {
    accessibleName = title || text;
  }

  // TODO: New code to be added here
  // New function or changes requested in the issue

  return accessibleName;
};

// Existing exports and functions continue to be preserved
// No changes to exports are allowed