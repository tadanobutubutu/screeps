// TODO: add the new functions or changes requested in the issue
// Here is the implementation for setting accessible names to SVGs

/**
 * Sets accessibility attributes on an SVG element.
 * @param {SVGElement} svgElement - The SVG element to update
 * @param {Object} accessibilityProps - Object containing accessibility properties
 * @param {string} [accessibilityProps.role='img'] - The ARIA role for the SVG
 * @param {string} [accessibilityProps['aria-label']] - The accessible name for the SVG
 * @param {string} [accessibilityProps['aria-labelledby']] - ID reference to label element
 * @param {string} [accessibilityProps['aria-describedby']] - ID reference to description element
 * @param {string} [accessibilityProps.tabindex] - Tab order of the element
 * @throws {Error} If svgElement or accessibilityProps are not provided
 */
function setSvgAccessibilityProps(svgElement, accessibilityProps) {
  if (!svgElement || !accessibilityProps) {
    throw new Error('Invalid arguments: svgElement and accessibilityProps are required.');
  }

  if (typeof svgElement.setAttribute !== 'function') {
    throw new Error('Invalid svgElement: must be an SVG element with setAttribute method.');
  }

  for (const [key, value] of Object.entries(accessibilityProps)) {
    if (value !== null && value !== undefined) {
      svgElement.setAttribute(key, value);
    }
  }
}

// Export the new function
module.exports = {
  setSvgAccessibilityProps,
};