// Assuming the `main.js` file is structured in a way that you can replace the conflicting lines
// with the following code. You'll need to find the exact locations of the conflicting lines
// and replace them accordingly.

// For `app/layout.tsx` at line 7:
const icons = {
    // ... other icons ...
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y="0.9em" font-size="90">🐛</text></svg>',
    apple: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>App Icon</title><text y="0.9em" font-size="90">🐛</text></svg>',
    // ... other icons ...
};

// For `dashboard/app/layout.tsx` at line 7:
const dashboardIcons = {
    // ... other icons ...
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true"><title>Dashboard Icon</title><text y="0.9em" font-size="90">🐛</text></svg>',
    apple: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true"><title>Dashboard Apple Icon</title><text y="0.9em" font-size="90">🐛</text></svg>',
    // ... other icons ...
};

// ... rest of your `main.js` ...