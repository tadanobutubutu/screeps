// Existing code that may be related to the issue
const icons = {
  // ... other icon definitions ...
  icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y="0.9em" font-size="90">🐛</text></svg>',
  apple: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="0.9em" font-size="90">🐛</text></svg>',
  // ... other icon definitions ...
};

// Code to fix the issue
icons.icon = icons.icon.replace('<svg', '<svg aria-label="Screeps Dashboard Icon">');
icons.apple = icons.apple.replace('<svg', '<svg aria-label="Screeps Apple Icon">');

// After updating the icons, the modified icons object should look like this:
console.log(icons);

// Rest of your main.js code
// ...

// Note: Ensure that this is not altering any other parts of your application that rely on the original string representation.