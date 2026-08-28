// main.js

/**
 * Sets an accessible name for an SVG element by adding an aria-label attribute.
 * @param {SVGElement} svg - The SVG element to modify.
 * @param {string} name - The accessible name to set.
 */
function setSvgAccessibleName(svg, name) {
  if (!svg) {
    console.warn('setSvgAccessibleName: SVG element is required');
    return;
  }
  svg.setAttribute('aria-label', name);
}

module.exports = { setSvgAccessibleName };