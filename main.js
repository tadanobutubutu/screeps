// main.js

// Helper function to create an accessible SVG element
function createAccessibleSVG(iconData, ariaLabel) {
  return {
    __html: iconData,
    ariaLabel: ariaLabel,
    role: 'img',
    'aria-hidden': 'true',
  };
}

// Example usage of the createAccessibleSVG function in the layout component
const icons = {
  icon: createAccessibleSVG(
    'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y="0.9em" font-size="90">🐛</text></svg>',
    'Screeps Dashboard Icon'
  ),
};

// Export the icons for use throughout the application
export { icons };