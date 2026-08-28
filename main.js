const renderHeader = require('./renderHeader');
const renderFooter = require('./renderFooter');

// Added imported modules to the relevant rendering functions
function renderHomePage() {
  return renderHeader() + '<div>Home Page</div>' + renderFooter();
}

function renderDashboard() {
  return renderHeader() + '<div>Dashboard Content</div>' + renderFooter();
}

module.exports = {
  renderHomePage,
  renderDashboard
};