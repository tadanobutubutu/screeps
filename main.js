// main.js
// [Your existing code remains unchanged]

// Add this function to handle SVG accessibility
function makeSvgAccessible(svgElement) {
  if (!svgElement) return;

  // Check if SVG already has an accessible name
  if (svgElement.getAttribute('aria-label') ||
      svgElement.querySelector('title') ||
      svgElement.getAttribute('aria-hidden') === 'true') {
    return;
  }

  // For favicon SVGs, mark as decorative if they don't need interaction
  if (svgElement.closest('link[rel="icon"]')) {
    svgElement.setAttribute('aria-hidden', 'true');
  } else {
    // For other SVGs, add a title element
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = 'Graphic element';
    svgElement.insertBefore(title, svgElement.firstChild);
  }
}

// Initialize accessibility for all SVGs on page load
document.addEventListener('DOMContentLoaded', () => {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(makeSvgAccessible);
});

// [Your existing exports remain unchanged]