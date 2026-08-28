function greet(name) {
  return `Hello, ${name}!`;
}

function addAccessibleNameToSVG(svgData) {
  return svgData.replace(/<svg /, '<svg aria-label="Accessible SVG" ');
}

// Export the greet function and the new function
module.exports = { greet, addAccessibleNameToSVG };