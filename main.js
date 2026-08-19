// main.js

// Existing code from main.js

// Add the new function or changes requested in the issue
function addAccessibleNameToSVG(svgElement) {
  // Check if the SVG is decorative and should be hidden
  if (svgElement.getAttribute('role') === 'img' || svgElement.classList.contains('deco')) {
    svgElement.setAttribute('aria-hidden', 'true');
  } else {
    // Add an aria-label if no title is present
    if (!svgElement.querySelector('title')) {
      svgElement.setAttribute('aria-label', 'SVG Image');
    }
  }
}

// Existing code continues...

// Example usage of the new function
// Assuming we have an SVG element with id 'favicon' in the DOM
const faviconSVG = document.getElementById('favicon');
addAccessibleNameToSVG(faviconSVG);

// Existing code continues...