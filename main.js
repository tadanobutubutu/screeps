// main.js

// Existing code and functions from current main.js
// ...

// Add new functions or changes requested in the issue
function fixSVGAccessibility(svgContent) {
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgContent, "image/svg+xml");
  const svgElement = svgDoc.documentElement;

  // Check if there's already an accessible name
  const titleElement = svgElement.querySelector('title');
  const ariaLabel = svgElement.getAttribute('aria-label');

  if (!titleElement && !ariaLabel) {
    // Add a title element if it doesn't exist
    const title = document.createElement('title');
    title.textContent = 'Accessible name for SVG';
    svgElement.insertBefore(title, svgElement.firstChild);
  }

  // Return the modified SVG content
  const serializer = new XMLSerializer();
  return serializer.serializeToString(svgElement);
}

// Example usage of the new function
const originalSVGContent = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐛</text></svg>';
const modifiedSVGContent = fixSVGAccessibility(originalSVGContent);

// Output the complete updated main.js content inside a block