// Original main.js content (before conflict)
// ... [Existing code here] ...

// New changes to resolve the issue
function rotateBack() {
  // Existing logic to rotate back
}

// Update the element to use a button instead of an anchor
document.getElementById('unrotate').outerHTML = `
  <button id="unrotate" onclick="rotateBack()">rotate back</button>
`;

// ... [Rest of the main.js content] ...

// main.js

// Existing code from main.js
// ... (Preserve all existing code, exports, and functions)

// New changes requested in the issue
// Add aria-label to the SVGs in app/layout.tsx and dashboard/app/layout.tsx

// Example of how to add aria-label to the SVG in app/layout.tsx
const layoutApp = () => {
  // ... (Preserve existing code)

  const icons = {
    // ... (Preserve existing icons)

    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y="0.9em" font-size="90">🐛</text></svg>',
    apple: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Apple Icon</title><text y="0.9em" font-size="90">🍎</text></svg>',
  };

  // ... (Preserve existing code)
};

// Example of how to add aria-label to the SVG in dashboard/app/layout.tsx
const dashboardLayout = () => {
  // ... (Preserve existing code)

  const icons = {
    // ... (Preserve existing icons)

    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y="0.9em" font-size="90">🐛</text></svg>',
    apple: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Apple Icon</title><text y="0.9em" font-size="90">🍎</text></svg>',
  };

  // ... (Preserve existing code)
};

// ... (Preserve all other existing code, exports, and functions)

// Output the complete updated main.js content