const UNROTATE_ID = 'unrotate';

// Function to ensure SVG elements have proper accessibility attributes
function ensureSvgAccessibility(svgElement) {
  if (!svgElement) return;

  // If SVG is decorative, add aria-hidden
  if (svgElement.getAttribute('aria-hidden') !== 'true') {
    // Check if it has a title or aria-label
    const hasTitle = svgElement.querySelector('title') !== null;
    const hasAriaLabel = svgElement.getAttribute('aria-label') !== null;

    if (!hasTitle && !hasAriaLabel) {
      // Add aria-hidden if it's decorative (like favicon)
      svgElement.setAttribute('aria-hidden', 'true');
    }
  }
}

// Function to process all SVGs in the document
function processAllSvgs() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    ensureSvgAccessibility(svg);
  });
}

// Run on DOM content loaded
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', processAllSvgs);
}