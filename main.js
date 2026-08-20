function calculate(a, b) {
  return a + b;
}

function addAccessibleNameToSVG(svg) {
  const titleElement = document.createElement('title');
  titleElement.textContent = 'Accessible name for SVG';
  svg.appendChild(titleElement);
  return svg;
}

// Existing code remains unchanged

// Example of existing exports that should be preserved
export { calculate, addAccessibleNameToSVG };

// Update to include the lang attribute in the HTML root element
export function updateRootElementWithLangAttribute() {
  const htmlElement = document.querySelector('html');
  if (htmlElement) {
    htmlElement.setAttribute('lang', 'en');
  }
}

// Existing export preservation
export { calculate, addAccessibleNameToSVG, updateRootElementWithLangAttribute };