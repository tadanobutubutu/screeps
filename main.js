// main.js

// ... (existing code, exports, and functions)

// Add the new function or changes requested in the issue
function addAccessibleNameToSVG(iconData) {
  // Parse the SVG data to a DOM element
  const parser = new DOMParser();
  const svg = parser.parseFromString(iconData, "image/svg+xml").documentElement;

  // Check if the SVG has a title element, if not, add one
  if (!svg.querySelector('title')) {
    const title = document.createElement('title');
    title.textContent = 'Screeps Dashboard Icon';
    svg.appendChild(title);
  }

  // Return the updated SVG data
  return new XMLSerializer().serializeToString(svg);
}

// ... (rest of the existing code)

// Example usage of the new function
const icons = {
  icon: addAccessibleNameToSVG('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="0.9em" font-size="90">🐛</text></svg>')
};

// ... (rest of the existing code)