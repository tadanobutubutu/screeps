// Assuming the icons are defined as an object
const icons = {
  favicon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y="0.9em" font-size="90">🐛</text></svg>',
  apple: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>App Icon</title><text y="0.9em" font-size="90">🍏</text></svg>',
  // ... other icons
};

// Updated icons with aria-label for accessibility
const accessibleIcons = {
  favicon: {
    src: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y="0.9em" font-size="90">🐛</text></svg>',
    alt: 'Screeps Dashboard Icon',
  },
  apple: {
    src: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>App Icon</title><text y="0.9em" font-size="90">🍏</text></svg>',
    alt: 'App Icon',
  },
  // ... other icons
};

// Export the accessibleIcons object
export { accessibleIcons };