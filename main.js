const dashboardComponents = require('./dashboard/components/Dashboard');

// Import the rotateBack function from the appropriate module
const rotateBack = require('./rotateBack'); // Assuming the function is exported from a module

// Preserving existing main.js structure and content
module.exports = dashboardComponents;

// Add the rotateBack function to the dashboardComponents if needed, or export it separately
// This depends on how the rotateBack function is intended to be used
// If it's meant to be used as a method on the dashboard, you might do something like this:
// dashboardComponents.rotateBack = rotateBack;

// If it's meant to be exported separately, you might do this:
// module.exports.rotateBack = rotateBack;