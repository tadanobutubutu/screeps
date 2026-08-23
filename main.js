// main.js
// Existing code from main.js that needs to be preserved
// ...

// Add an accessible name to the SVGs in the icons object
const icons = {
  icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y="0.9em" font-size="90">🐛</text></svg>',
  apple: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Apple Icon</title><text y="0.9em" font-size="90">🍎</text></svg>',
  myCustomIcon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>My Custom Icon</title><text y="0.9em" font-size="90">🌐</text></svg>',
};

// Prevent duplication of existing exports (both new changes are integrated)
Object.entries(currentExports).forEach(([key, value]) => {
  if (!icons.hasOwnProperty(key) && ['icon', 'apple'].indexOf(key) === -1) {
    icons[key] = value;
  }
});

Object.assign(icons, newExports); // Incorporate new export from the conflicting branch (myCustomIcon)

exports.icons = icons;

// Rest of the code from main.js
// ...