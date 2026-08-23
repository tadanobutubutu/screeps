const dashboardComponents = require('./dashboard/components/Dashboard');

// Adding new function to add accessible name to SVGs
function addAccessibleNameToSVG(icon) {
  return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y="0.9em" font-size="90">🐛</text></svg>`;
}

// Preserving existing main.js structure and content
module.exports = dashboardComponents;