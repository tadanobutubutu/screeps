// Existing main.js content before conflict markers
// ... (preserve all existing code, exports, and functions)

// New changes requested in the issue
// Add aria-label to the SVG element in app/layout.tsx
const layout = () => {
  // ... (preserve existing code)
  const icons = {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y="0.9em" font-size="90">🐛</text></svg>',
  };
  // ... (preserve existing code)
};

// Add aria-hidden="true" to the SVG element in dashboard/app/layout.tsx
const dashboardLayout = () => {
  // ... (preserve existing code)
  const icons = {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true"><title>Screeps Dashboard</title><text y="0.9em" font-size="90">🐛</text></svg>',
  };
  // ... (preserve existing code)
};

// ... (preserve all existing code, exports, and functions after conflict markers)