document.addEventListener('DOMContentLoaded', (event) => {
  const htmlTag = document.documentElement;
  if (!htmlTag.lang) {
    htmlTag.setAttribute('lang', 'en');
  }

  // Add accessible names to SVG elements that do not have one
  const svgElements = document.querySelectorAll('svg');
  svgElements.forEach(svg => {
    // Check if the SVG already has an aria-label or aria-hidden
    if (!svg.getAttribute('aria-label') && !svg.querySelector('title')) {
      // If not, add aria-hidden="true" to hide it from screen readers
      svg.setAttribute('aria-hidden', 'true');
    }
  });
});