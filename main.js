const UNROTATE_ID = 'unrotate';

/**
 * Adds accessibility attributes to SVG elements
 * @param {SVGElement} svgElement - The SVG element to make accessible
 * @param {string} label - The accessible name for the SVG
 */
function makeSvgAccessible(svgElement, label) {
  if (!svgElement) return;

  // Add aria-label if provided
  if (label) {
    svgElement.setAttribute('aria-label', label);
  } else {
    // If no label provided, mark as decorative
    svgElement.setAttribute('aria-hidden', 'true');
  }
}

export { UNROTATE_ID, makeSvgAccessible };