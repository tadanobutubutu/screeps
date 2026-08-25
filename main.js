// Assuming main.js is the entry point for your Screeps bot application

// Import the icons from the respective files
const icons = require('./app/layout.tsx').icons; // For app/layout.tsx
const dashboardIcons = require('./dashboard/app/layout.tsx').icons; // For dashboard/app/layout.tsx

// Create a function to add aria-label to the SVG data string
function addAriaLabelToSvg(svgData, label) {
  return svgData.replace(/<svg /, `<svg aria-label="${label} "`);
}

// Create a function to add aria-hidden="true" to the SVG data string for decorative SVGs
function addAriaHiddenToSvg(svgData) {
  return svgData.replace(/<svg /, '<svg aria-hidden="true" ');
}

// Update the SVG data with an accessible name for both icons
const updatedIcons = {
  ...icons,
  icon: addAriaLabelToSvg(icons.icon, 'Screeps Dashboard Icon'),
};

const updatedDashboardIcons = {
  ...dashboardIcons,
  icon: addAriaLabelToSvg(dashboardIcons.icon, 'Screeps Dashboard Icon'),
};

// Merge the updated icons
const allIcons = { ...updatedIcons, ...updatedDashboardIcons };

// Apply aria-hidden="true" to all decorative favicon SVG data strings
// to prevent screen readers from announcing them as 'image'
if (allIcons.icon) {
  allIcons.icon = addAriaHiddenToSvg(allIcons.icon);
}
if (allIcons.apple) {
  allIcons.apple = addAriaHiddenToSvg(allIcons.apple);
}

// Export the merged icons
module.exports = allIcons;