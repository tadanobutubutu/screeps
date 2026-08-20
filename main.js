// main.js
// [Your existing code remains unchanged]

// Add this new function to handle SVG accessibility
function makeSvgAccessible(svgElement) {
  if (!svgElement) return;

  // Check if SVG already has accessibility attributes
  if (svgElement.getAttribute('aria-label') ||
      svgElement.getAttribute('aria-hidden') ||
      svgElement.querySelector('title')) {
    return;
  }

  // For favicon SVG (dashboard/app/layout.tsx)
  if (svgElement.closest('#favicon')) {
    svgElement.setAttribute('aria-hidden', 'true');
  }
  // For metadata SVG (app/layout.tsx)
  else if (svgElement.closest('head')) {
    svgElement.setAttribute('aria-label', 'Application icon');
  }
  // For other SVGs, add a title element
  else {
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

// [Rest of your existing code remains unchanged]