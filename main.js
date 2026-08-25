// Existing code and exports from main.js preserved here
// ...

// New function to add accessible name to SVGs
function addAccessibleNameToSVG(svgString) {
  return svgString.replace(/<svg.*?>/g, (match) => {
    const svgStart = match;
    const titleEnd = svgString.indexOf('</svg>', svgStart.length);
    const title = svgString.slice(svgStart.length, titleEnd);
    const textEnd = svgString.indexOf('</svg>', titleEnd);
    const text = svgString.slice(titleEnd, textEnd);
    const svgEnd = svgString.slice(textEnd);
    return `${svgStart}<title>${title}</title>${text}${svgEnd}`;
  });
}

// Function to update the icons with accessible names
function updateIcons(icons) {
  return Object.entries(icons).reduce((acc, [key, value]) => {
    acc[key] = addAccessibleNameToSVG(value);
    return acc;
  }, {});
}

// Update the icons in the main.js file
const mainIcons = {
  icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><title>Screeps Dashboard</title><text y=%22.9em%22 font-size=%2290%22>🐛</text></svg>',
  apple: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐛</text></svg>',
};

const updatedIcons = updateIcons(mainIcons);

// Output the complete updated main.js content
module.exports = {
  // Preserve existing code and exports
  // ...

  // New exports
  updatedIcons,
  // ...
};