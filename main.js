// Original main.js content preserved
// ...

// New function or changes requested in the issue
function updateSVGAccessibility() {
  const svgElements = document.querySelectorAll('svg');

  svgElements.forEach(svg => {
    // Check if the SVG has a title or text element
    if (!svg.querySelector('title') && !svg.querySelector('text') && !svg.getAttribute('aria-label')) {
      // If it doesn't, add aria-hidden="true" to make it decorative and not announced by screen readers
      svg.setAttribute('aria-hidden', 'true');
    }
  });
}

// Existing code, exports, and functions preserved
// ...

// Add the new function to be called after DOM content is loaded
document.addEventListener('DOMContentLoaded', updateSVGAccessibility);

// ...