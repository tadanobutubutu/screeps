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

// Ensure that there is only one <main> element in the document
function ensureSingleMain() {
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length > 1) {
    // If there is more than one <main> element, remove all but the first
    for (let i = 1; i < mainElements.length; i++) {
      mainElements[i].parentNode.removeChild(mainElements[i]);
    }
  }
}

// Run the function to ensure there's only one <main>
document.addEventListener('DOMContentLoaded', ensureSingleMain);

// [Rest of your existing code remains unchanged]