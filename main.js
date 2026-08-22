// Assuming main.js contains the following structure for the icons configuration:

const icons = {
  // ... other icons ...
  icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><title>Screeps Dashboard</title><text y=%22.9em%22 font-size=%2290%22>🐛</text></svg>',
  apple: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐛</text></svg>',
  // ... other icons ...
};

// Add aria-hidden="true" to the SVG data URLs
const updatedIcons = Object.keys(icons).reduce((acc, key) => {
  acc[key] = `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22 aria-hidden=%22true%22><title>Screeps Dashboard</title><text y=%22.9em%22 font-size=%2290%22>🐛</text></svg>`;
  return acc;
}, icons);

// Replace the original icons with the updated ones
export const icons = updatedIcons;