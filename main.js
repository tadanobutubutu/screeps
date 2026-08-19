// [Your existing main.js content above this point remains unchanged]

// Add this new function to handle SVG accessibility
function makeSvgAccessible(svgElement) {
  if (!svgElement.getAttribute('aria-label') &&
      !svgElement.querySelector('title') &&
      !svgElement.getAttribute('aria-hidden')) {
    svgElement.setAttribute('aria-hidden', 'true');
  }
}

// [Your existing main.js content below this point remains unchanged]

// Example of how you might use this function in your components
// You would need to call this function after rendering the SVG elements
// For instance, in a useEffect hook or after DOM manipulation