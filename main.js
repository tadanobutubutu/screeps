// This is a simple module
const greeting = "Hello";

// TODO: Implement the new function as per the issue requirements
function newFunction() {
  // Implementation goes here
  return "newFunction implemented";
}

/**
 * Implementation of getSvgAccessibleName
 * @param {SVGSVGElement} svgElement
 * @returns {string|null}
 */
function getSvgAccessibleName(svgElement) {
  if (!svgElement) return null;

  // 1. Check aria-label
  if (svgElement.getAttribute('aria-label')) {
    return svgElement.getAttribute('aria-label');
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
    return titleElement.textContent;
  }

  return null;
}

module.exports = {
  greeting,
  newFunction,
  getSvgAccessibleName
};