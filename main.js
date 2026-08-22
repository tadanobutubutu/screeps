// main.js

// Preserve existing code and exports from current main.js
// ... (existing code and exports)

// Add the new functions or changes requested in the issue
// For both occurrences, we'll add an `aria-label` attribute to the SVG element.

const newIcons = {
    ...icons,
    icon: '<svg viewBox="0 0 100 100" aria-label="Screeps Dashboard" xmlns="http://www.w3.org/2000/svg"><title>Screeps Dashboard</title><text y=".9em" font-size="18" x="50%" text-anchor="middle">Dashboard</text></svg>',
    apple: '<svg viewBox="0 0 100 100" aria-label="Screeps Apple Logo" xmlns="http://www.w3.org/2000/svg"><title>Screeps Apple Logo</title><text y=".9em" font-size="18" x="50%" text-anchor="middle">Apple</text></svg>'
};

// Replace the existing icons with the updated version
icons = newIcons;

// ... (rest of main.js)

// Output the complete updated main.js content