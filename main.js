const dashboardComponents = require('./dashboard/components/Dashboard');

// Ensuring there is only one <main> element in the rendered tree
const Dashboard = dashboardComponents.default;

module.exports = {
  ...dashboardComponents,
  Dashboard: Dashboard,
};