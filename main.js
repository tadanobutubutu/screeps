// Assuming main.js is the entry point for your Screeps bot application

function main() {
  // Existing code from main.js

  // Add the new <main> landmark wrapping the primary content
  const mainContent = document.createElement('main');
  // Assuming the primary content is wrapped in a div with class 'primary-content'
  const primaryContent = document.querySelector('.primary-content');
  mainContent.appendChild(primaryContent);

  // Append the new <main> element to the body or appropriate parent element
  document.body.appendChild(mainContent);

  return 'Hello, World!';
}

// Import the icons from the respective files
const icons = require('./app/layout.tsx').icons; // For app/layout.tsx
const dashboardIcons = require('./dashboard/app/layout.tsx').icons; // For dashboard/app/layout.tsx

// Create a function to add aria-label to the SVG data string
function addAriaLabelToSvg(svgData, label) {
  return svgData.replace(/<svg /, `<svg aria-label="${label} "`);
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

// Export the merged icons
module.exports = allIcons;