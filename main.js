// main.js or wherever the icons are being used

// Example of adding aria-hidden="true" to the SVG data URL
const icons = {
  icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true"><title>Screeps Dashboard</title><text y="0.9em" font-size="90">🐛</text></svg>',
  apple: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true"><title>Apple Icon</title><text y="0.9em" font-size="90">🍎</text></svg>',
  // ... other icons
};

// Assuming you are using these icons in your components, you would use them like this:
// <img src={icons.icon} alt="Accessible description of the icon" />
// or if they are being used as SVG elements directly:
// <svg dangerouslySetInnerHTML={{ __html: icons.icon }} />