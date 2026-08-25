// main.js

// Existing code and exports from current main.js
// ...

// New function or changes requested in the issue
function addAccessibleNameToSVG(svgData) {
  // Assuming svgData is a string containing the SVG XML
  // This function will return the SVG XML with an added aria-label attribute
  return svgData.replace('<svg', '<svg aria-label="Accessible SVG Description">');
}

// Example usage of the new function in the codebase
// Replace the following lines in the relevant files:
// icons: { icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><title>Screeps Dashboard</title><text y=%22.9em%22 font-size=%2290%22>🐛</text></svg>' },
// with:
// icons: { icon: addAccessibleNameToSVG('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><title>Screeps Dashboard</title><text y=%22.9em%22 font-size=%2290%22>🐛</text></svg>') },

// ...