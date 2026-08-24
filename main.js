const getAccessibleName = (node) => {
  const { svg, title, text } = node;

  let accessibleName = 'unknown';

  if (svg && svg.nodeName.toLowerCase() === 'svg') {
    accessibleName = title || text;
  }

  return accessibleName;
};