// Existing code and exports remain unchanged

// Adding a new function or changes as requested in the issue
module.exports = {
  // Existing exports...
  addAccessibleNameToSVG: function(svgData) {
    return svgData.replace(/<svg[^>]*>/g, (match) => {
      return match.replace('</svg>', ' aria-label="Accessible name for SVG" />');
    });
  }
};