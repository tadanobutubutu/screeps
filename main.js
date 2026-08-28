// Imports at the top of the file
const { utility1, utility2 } = require('./utils');
const { formatData, processValues } = require('./helpers');

// TODO: Add these imported modules to the relevant rendering functions

function renderHomePage(data) {
  // Render home page
  const formattedData = formatData(data);
  const processedValues = processValues(formattedData);
  return `<div>${processedValues}</div>`;
}

function renderUserProfile(user) {
  // Render user profile
  const formattedUser = formatData(user);
  return `<profile>${formattedUser.name}</profile>`;
}

function renderDashboard(stats) {
  // Render dashboard
  const processed = processValues(stats);
  const formatted = utility1(processed);
  return `<dashboard>${formatted}</dashboard>`;
}

function renderSettings(config) {
  // Render settings
  return `<settings>${config.name}</settings>`;
}

module.exports = {
  renderHomePage,
  renderUserProfile,
  renderDashboard,
  renderSettings
};