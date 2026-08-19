// main.js
// Existing code preserved...

// Function to rotate element
function rotate(element, degrees) {
  element.style.transform = `rotate(${degrees}deg)`;
}

// Create the button element for "rotate back" action
function createUnrotateButton() {
  const button = document.createElement('button');
  button.id = 'unrotate';
  button.textContent = 'rotate back';
  button.type = 'button';
  button.addEventListener('click', () => {
    const target = document.getElementById('rotatable');
    if (target) {
      rotate(target, 0);
    }
  });
  return button;
}

// Example usage
const container = document.getElementById('controls');
if (container) {
  container.appendChild(createUnrotateButton());
}

// Add accessibility fix for SVGs
function addSvgAccessibility() {
  // Find all SVG elements in the document
  const svgs = document.querySelectorAll('svg');

  svgs.forEach(svg => {
    // Check if the SVG is decorative (no semantic meaning)
    if (!svg.querySelector('title, text, foreignObject') &&
        !svg.getAttribute('aria-label') &&
        !svg.getAttribute('aria-labelledby')) {
      // Add aria-hidden if decorative
      svg.setAttribute('aria-hidden', 'true');
    }
  });
}

// Run accessibility fix when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addSvgAccessibility);
} else {
  addSvgAccessibility();
}