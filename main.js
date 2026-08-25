// Assuming main.js is the entry point for your Screeps bot application

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

// Wrap the primary content in <main> to provide a landmark for accessibility
const mainContent = `
<main>
  <table id="table-rotated">
    <!-- table content here -->
  </table>
</main>
`;

const indexContent = `
<main>
  <div class="container">
    <h2>Quality & Metrics Reports</h2>
    <p>This repository is fully optimized with automated tools. Explore the generated reports below:</p>
    <div class="links">
      <a href="plato-report/index.html">📊 Plato Code Complexity Report</a>
      <a href="dependency-graph.html">🕸️ Dependency Graph (Dependency-Cruiser)</a>
    </div>
  </div>
</main>
`;

// Export the main content to be used in your HTML files
module.exports.mainContent = mainContent;
module.exports.indexContent = indexContent;