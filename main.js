// Assuming the original main.js content is as follows:
// ... other code ...

// Add the following changes to the relevant SVG elements
const updateSVGAccessibility = () => {
  // Assuming the SVG elements have an id of 'favicon' or similar
  const svgElements = document.querySelectorAll('svg[id="favicon"], svg[id="decorative-svg"]');

  svgElements.forEach(svg => {
    svg.setAttribute('aria-hidden', 'true');
  });
};

// Call the function to update the accessibility of SVG elements
updateSVGAccessibility();

// ... other code ...