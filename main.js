// TODO: This is the existing code that needs to be preserved
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// Original logic preserved from commit dbc62f0d7ea6e8ed531f9712000039619b9f3d51

// Imports at the top of the file
import { utility1, utility2 } from './utils';
import { formatData, processValues } from './helpers';

// New function added from the other branch
export function calculateTotal(items) {
  return items.reduce((total, item) => total + item.price, 0);
}

// Render home page
function renderHomePage(data) {
  // Render home page
  const formattedData = formatData(data);
  const processedValues = processValues(formattedData);
  return `<div>${processedValues}</div>`;
}

// Render user profile
function renderUserProfile(user) {
  // Render user profile
  const formattedUser = formatData(user);
  return `<profile>${formattedUser.name}</profile>`;
}

// Render dashboard
function renderDashboard(stats) {
  // Render dashboard
  const processed = processValues(stats);
  const formatted = utility1(processed);
  return `<dashboard>${formatted}</dashboard>`;
}

// Render settings
function renderSettings(config) {
  // Render settings
  return `<settings>${config.name}</settings>`;
}

export default {
  renderHomePage,
  renderUserProfile,
  renderDashboard,
  renderSettings
};

module.exports = {};