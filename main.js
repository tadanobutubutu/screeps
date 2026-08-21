// main.js

// Preserve existing code and exports from current main.js
// ... (existing code and exports)

// Add the new functions or changes requested in the issue
// For both occurrences, we'll add an `aria-label` attribute to the SVG element.

const newIcons = {
    ...icons,
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22 aria-label=%22Screeps Dashboard%22><title>Screeps Dashboard</title><text y=%22.9em%22 font-size=%2290%22>🐛</text></svg>',
    apple: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22 aria-label=%22Screeps Apple Logo%22><title>Screeps Apple Logo</title><text y=%22.9em%22 font-size=%2290%22>🐛</text></svg>',
};

// Replace the existing icons with the updated version
icons = newIcons;

// ... (rest of main.js)

// Output the complete updated main.js content