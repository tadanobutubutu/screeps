// Assuming 'icons' is an object that holds SVG data URLs for different icons
const icons = {
  // ... other icons ...

  // Fix for the favicon SVG in app/layout.tsx
  icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><title>Screeps Dashboard</title><text y=%22.9em%22 font-size=%2290%22>🐛</text><aria-label="Screeps Dashboard Icon"></svg>',

  // Fix for the favicon SVG in dashboard/app/layout.tsx
  favicon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><title>Screeps Dashboard</title><text y=%22.9em%22 font-size=%2290%22>🐛</text><aria-label="Screeps Dashboard Icon"></svg>',

  // ... other icons ...
};

// Export the modified 'icons' object
export { icons };