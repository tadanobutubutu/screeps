// existing code...

// New function or changes for accessibility
function getAccessibleSvg(svgContent) {
  return svgContent.replace('<svg', '<svg aria-hidden="true"');
}

// Assuming 'icons' is an object containing SVG content
// Example usage of getAccessibleSvg to update the 'icon' and 'apple' fields in the 'icons' object
const icons = {
  icon: getAccessibleSvg('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y="0.9em" font-size="90">🐛</text></svg>'),
  apple: getAccessibleSvg('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="0.9em" font-size="90">🐛</text></svg>'),
};

// existing code...