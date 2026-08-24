function main() {
  return 'Hello, World!';
}

// Adding a new function to add aria-label to SVGs for accessibility
function addAriaLabelToSVG(svgString) {
  return svgString.replace(/<svg/g, '<svg aria-label="Accessible Name for SVG"');
}

module.exports = { main, addAriaLabelToSVG };