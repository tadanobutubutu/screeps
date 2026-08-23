// Assuming the main.js file contains the following structure for setting up icons:
// icons: {
//   icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y="0.9em" font-size="90">🐛</text></svg>',
// },

// Update the icons object to include aria-hidden="true" for accessibility
const icons = {
  icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true"><title>Screeps Dashboard</title><text y="0.9em" font-size="90">🐛</text></svg>',
};

// ... rest of the main.js content

module.exports = {
  // ... other exports
  icons,
  // ... other exports
};