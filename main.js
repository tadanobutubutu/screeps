// Existing code and exports from main.js

// Add new function or changes as requested in the issue
function addAccessibleNameToSVG(svgData) {
  // This function takes SVG data as a string and returns it with an accessible name added
  return svgData.replace('<svg', '<svg aria-label="Accessible SVG">');
}

// Replace the existing SVG data with the new version that includes an accessible name
const icons = {
  icon: addAccessibleNameToSVG('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y="0.9em" font-size="90">🐛</text></svg>'),
  apple: addAccessibleNameToSVG('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="0.9em" font-size="90">🐛</text></svg>'),
};

// Output the complete updated main.js content