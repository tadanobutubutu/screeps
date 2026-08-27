function getSvgAccessibleName(svgElement) {
  if (!svgElement || !(svgElement instanceof SVGElement)) {
    return '';
  }

  // Use the first descendant text or title element's text content as the accessible name
  const textElement = svgElement.querySelector('text, title');
  return textElement ? textElement.textContent.trim() : svgElement.nodeName.toLowerCase();
}

module.exports = {
  // Existing exports and functions here...

  getSvgAccessibleName,
};