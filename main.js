// Existing code preserved from main.js (if any)

// New function or changes requested to fix the issue

// Example of adding an accessible name to an SVG element
function createAccessibleSVG(iconData) {
  return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y="0.9em" font-size="90">${iconData}</text></svg>`;
}

// Example usage of the function
const icons = {
  icon: createAccessibleSVG('🐛'),
  apple: createAccessibleSVG('🐛')
};

// Ensure that the icons are updated with the accessible SVGs
export const iconConfig = icons;