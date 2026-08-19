// main.js
// [Your existing code remains unchanged]

// Add this function to handle SVG accessibility
function makeSvgAccessible(svgElement) {
  if (!svgElement.getAttribute('aria-hidden')) {
    svgElement.setAttribute('aria-hidden', 'true');
  }
  return svgElement;
}

// Apply the accessibility fix to all SVGs in the document
document.addEventListener('DOMContentLoaded', () => {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    makeSvgAccessible(svg);
  });
});

// [Your existing exports remain unchanged]