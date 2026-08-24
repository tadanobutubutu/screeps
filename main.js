// main.js - Updated to fix REACT_041 (React SVG Accessible Name)

// Define icons with aria-hidden="true" for decorative SVGs
const icons = {
  // For app/layout.tsx
  app: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true"><title>Screeps Dashboard</title><text y=".9em" font-size="90">🐛</text></svg>',
    apple: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true"><text y=".9em" font-size="90">🐛</text></svg>'
  },
  // For dashboard/app/layout.tsx
  dashboard: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true"><title>Screeps Dashboard</title><text y=".9em" font-size="90">🐛</text></svg>'
  }
};

module.exports = icons;