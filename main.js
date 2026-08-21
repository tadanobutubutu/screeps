// Existing main.js content
// ...

// Add new functions or changes requested in the issue
// No new functions are needed for this issue, but we will include the changes to make the SVGs accessible

// Example of refactoring the SVG elements in the icons to include an accessible name
function getAccessibleSVG(iconData) {
    return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y="0.9em" font-size="90">${iconData}</text></svg>`;
}

// Update the icons object to include aria-label for accessibility
const icons = {
    icon: getAccessibleSVG('🐛'),
    apple: getAccessibleSVG('🐛'),
};

// ...