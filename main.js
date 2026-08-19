// main.js
// [Your existing code remains unchanged]

// Add this function to ensure SVGs have accessible names
function ensureSvgAccessibility(svgElement) {
  if (!svgElement.getAttribute('aria-hidden') && !svgElement.querySelector('title')) {
    // Add a title element if none exists
    const title = document.createElement('title');
    title.textContent = 'Decorative graphic';
    svgElement.insertBefore(title, svgElement.firstChild);

    // Alternatively, you could add aria-label:
    // svgElement.setAttribute('aria-label', 'Decorative graphic');
  }
}

// Call this function when your app initializes
document.addEventListener('DOMContentLoaded', () => {
  // Find all SVG elements in the document
  const svgs = document.querySelectorAll('svg');

  // Ensure each SVG has an accessible name
  svgs.forEach(svg => {
    ensureSvgAccessibility(svg);
  });
});

// [Your existing exports remain unchanged]