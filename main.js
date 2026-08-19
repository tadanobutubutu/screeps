// main.js
// ... (existing code remains unchanged)

/**
 * Adds accessible name to SVG elements to comply with REACT_041 rule
 * @param {React.ReactElement} svgElement - The SVG element to make accessible
 * @param {string} label - The accessible name for the SVG
 * @returns {React.ReactElement} The accessible SVG element
 */
function makeSvgAccessible(svgElement, label) {
  return React.cloneElement(svgElement, {
    'aria-label': label,
    role: 'img'
  });
}

// ... (rest of existing code remains unchanged)