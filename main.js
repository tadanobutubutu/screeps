// main.js
// ... existing code ...

// Add this function to handle SVG accessibility
function makeSvgAccessible(svgElement) {
  if (!svgElement) return;

  // If SVG is decorative, mark it as hidden
  if (svgElement.getAttribute('aria-hidden') === 'true') {
    return;
  }

  // Add accessible name if not already present
  if (!svgElement.getAttribute('aria-label') && !svgElement.querySelector('title')) {
    const title = document.createElement('title');
    title.textContent = 'Application icon';
    svgElement.prepend(title);
  }
}

// Call this function when your app initializes
document.addEventListener('DOMContentLoaded', () => {
  // Find all SVGs in the document
  const svgs = document.querySelectorAll('svg');

  // Make each SVG accessible
  svgs.forEach(makeSvgAccessible);
});

// ... rest of existing code ...