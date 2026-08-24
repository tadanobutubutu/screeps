module.exports = {
  // ... existing code ...
  
  // New function to add accessible name to SVGs if necessary
  addAccessibleNameToSVG: (svgElement) => {
    // Check if the SVG is decorative and lacks an accessible name
    if (svgElement.getAttribute('aria-hidden') !== 'true') {
      // If no aria-label is set, add an aria-label with a generic name
      if (!svgElement.getAttribute('aria-label')) {
        svgElement.setAttribute('aria-label', 'Decorative SVG');
      }
      // Alternatively, you could add a <title> child to the SVG
      // const title = document.createElement('title');
      // title.textContent = 'Decorative SVG';
      // svgElement.appendChild(title);
    }
  },

  // ... existing exports ...
};