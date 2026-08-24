// main.js

// ... existing code ...

// Example of how to address the issue in the affected files
// Assuming the icons are being used as part of a larger component that renders them

// Before the fix:
// icons: { icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="0.9em" font-size="90">🐛</text></svg>' },

// After the fix:
// icons: { icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-label="Screeps Dashboard"><title>Screeps Dashboard</title><text y="0.9em" font-size="90">🐛</text></svg>' },

// ... rest of the existing code ...

// Note: The above is a conceptual fix, and the actual implementation may vary depending on how the icons are used in the application.

// ... existing code ...

// Example of how to address the issue in the affected files
// Assuming the icons are being used as part of a larger component that renders them

// Before the fix:
// icons: {
//     icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="0.9em" font-size="90">🐛</text></svg>',
//     apple: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="0.9em" font-size="90">🐛</text></svg>',
// },

// After the fix:
// icons: {
//     icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-label="Screeps Dashboard"><title>Screeps Dashboard</title><text y="0.9em" font-size="90">🐛</text></svg>',
//     apple: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-label="Screeps Dashboard Apple Icon"><title>Screeps Dashboard Apple Icon</title><text y="0.9em" font-size="90">🐛</text></svg>',
// },

// ... rest of the existing code ...