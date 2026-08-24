const dashboardComponents = require('./dashboard/components/Dashboard');

// Adding new function to add accessible name to SVGs
function addAccessibleNameToSVG(icon) {
  return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y="0.9em" font-size="90">🐛</text></svg>`;
}

// Adding a new function export to main.js if there's a need for it to be used elsewhere
// Note: We'll name it 'addAccessibleNameToSVG' since it seems this is the intent based on the function declaration.
module.exports = {
  dashboardComponents,
  addAccessibleNameToSVG
};