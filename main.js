// main.js

// Existing code...
// ... (Preserve all existing code, exports, and functions)

// Add the new function or changes requested in the issue
function addAccessibleNameToSVG(svgElement) {
  if (!svgElement) return;

  // Check if the SVG already has an accessible name
  if (!svgElement.querySelector('[aria-label]') && !svgElement.querySelector('title')) {
    // Add an aria-label attribute if it doesn't have a title child
    svgElement.setAttribute('aria-label', 'SVG Icon');
  }
}

// Example usage of the function
const svgElement = document.querySelector('svg');
addAccessibleNameToSVG(svgElement);

// ... (Preserve all existing code, exports, and functions)

// Output the complete updated main.js content