/**
 * Utility functions for SVG accessibility
 */

/**
 * Implementation of getSvgAccessibleName
 * @param {SVGSVGElement} svgElement 
 * @returns {string|null}
 */
function getSvgAccessibleName(svgElement) {
  if (!svgElement) return null;

  // 1. Check aria-label
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (ariaLabel && ariaLabel.trim()) {
    return ariaLabel.trim();
  }

  // 2. Check aria-labelledby
  const ariaLabelledBy = svgElement.getAttribute('aria-labelledby');
  if (ariaLabelledBy) {
    const labelElement = document.getElementById(ariaLabelledBy);
    if (labelElement) return labelElement.textContent;
  }

  // 3. Check <title> element inside SVG
  const titleElement = svgElement.querySelector('title');
  if (titleElement && titleElement.textContent) {
    return titleElement.textContent.trim();
  }

  return null;
}

// ... existing code and exports ...

module.exports = {
  getSvgAccessibleName
};