// Assuming main.js is the entry point for your React application

// Import the icons from the respective files
const icons = require('./app/layout.tsx').icons; // For app/layout.tsx
const dashboardIcons = require('./dashboard/app/layout.tsx').icons; // For dashboard/app/layout.tsx

// Create a function to add aria-label to the SVG data string
function addAriaLabelToSvg(svgData, label) {
  return svgData.replace(/<svg /, `<svg aria-label="${label} "`);
}

// Update the SVG data with an accessible name
const updatedIcons = {
  ...icons,
  icon: addAriaLabelToSvg(icons.icon, 'Screeps Dashboard Icon'),
};

const updatedDashboardIcons = {
  ...dashboardIcons,
  icon: addAriaLabelToSvg(dashboardIcons.icon, 'Screeps Dashboard Icon'),
};

// Export the updated icons
module.exports = {
  ...updatedIcons,
  ...updatedDashboardIcons,
};