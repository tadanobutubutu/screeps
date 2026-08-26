// Example of the problematic SVG data URL
const problemSvgData = `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐛</text></svg>`;

// Wrap the SVG data URL with a div for accessibility
const accessibleSvgWrapper = (svgData, label) => {
  return `<div aria-label="${label}" role="img">${svgData}</div>`;
};

// Updated icons object with accessibility improvements
const icons = {
  icon: accessibleSvgWrapper(problemSvgData, 'Screeps Dashboard Icon'),
  apple: accessibleSvgWrapper(problemSvgData, 'Apple Touch Icon')
};

// Current main.js content with conflict markers removed for readability