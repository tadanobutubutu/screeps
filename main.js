function calculate(a, b) {
  return a + b;
}

function addAccessibleNameToSVG(svgString) {
  const svgElement = new DOMParser().parseFromString(svgString, "image/svg+xml").documentElement;
  const titleElement = document.createElement('title');
  titleElement.textContent = 'Accessible name for SVG';
  svgElement.appendChild(titleElement);
  return new XMLSerializer().serializeToString(svgElement);
}

// Existing code remains unchanged

// Example of existing exports that should be preserved
export { calculate, addAccessibleNameToSVG };