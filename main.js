// ... [other code] ...

// Example of how to add an accessible name to an SVG element
function createAccessibleSvg(iconData) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <title>Screeps Dashboard</title>
    <text y="0.9em" font-size="90">${iconData}</text>
    <aria-label="Screeps Dashboard Icon"> <!-- Added accessible name -->
  </svg>`;
}

// ... [other code] ...

// Assuming `icons` is an object that holds SVG data, update it like this:
const icons = {
  icon: createAccessibleSvg('🐛'), // Replace '🐛' with the actual icon data
};

// ... [other code] ...

// Ensure that the rest of your code remains unchanged and that you only modify the parts
// that are directly related to the SVGs that are causing the issue.