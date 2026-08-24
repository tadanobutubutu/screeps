// ... (other code and imports)

// Example of the original SVG structure that needs an accessible name
const originalSVG = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="0.9em" font-size="90">🐛</text></svg>';

// Updated SVG with an accessible name added
const accessibleSVG = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-label="Screeps Dashboard"><title>Screeps Dashboard</title><text y="0.9em" font-size="90">🐛</text></svg>';

// Assuming 'icons' is an object where the SVGs are stored, update it with the accessible SVG
const icons = {
  icon: accessibleSVG
};

// ... (other code)

export { icons };