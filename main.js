// TODO: Implement getSvgAccessibleName() function here

/**
 * Gets the accessible name of an SVG element.
 * Follows ARIA accessible name computation for SVG elements.
 * 
 * @param {Element} svgElement - The SVG element to get the accessible name from
 * @returns {string|null} The accessible name or null if not found
 */
function getSvgAccessibleName(svgElement) {
  // Return null for invalid input
  if (!svgElement || !svgElement.getAttribute) {
    return null;
  }

  // Check aria-labelledby first (highest precedence)
  const labelledBy = svgElement.getAttribute('aria-labelledby');
  if (labelledBy && labelledBy.trim()) {
    const element = svgElement.ownerDocument?.getElementById(labelledBy.trim());
    if (element && element.textContent) {
      return element.textContent.trim();
    }
  }

  // Check aria-label
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (ariaLabel && ariaLabel.trim()) {
    return ariaLabel.trim();
  }

  // Check for title element (lowest precedence)
  const title = svgElement.querySelector(':scope > title');
  if (title && title.textContent) {
    return title.textContent.trim();
  }

  return null;
}

module.exports = {
  getSvgAccessibleName
};