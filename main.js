// main.js
// [Your existing code remains unchanged]

// Add these new functions to handle SVG accessibility
function addSvgAccessibility(svgElement) {
  if (!svgElement.hasAttribute('aria-hidden') && !svgElement.querySelector('title')) {
    svgElement.setAttribute('aria-label', 'Application icon');
  }
}

// Initialize accessibility for all SVGs
document.addEventListener('DOMContentLoaded', () => {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    addSvgAccessibility(svg);
  });
});

// [Rest of your existing code remains unchanged]