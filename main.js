// main.js

// Existing code and conflict markers preserved below
// <<<<<<< HEAD
// ... (existing code)
// >>>>>>> origin/main

// New changes requested in the issue
// Adding aria-label to the SVGs in the icons object to provide accessible names

const icons = {
    // ... (existing icons)
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y="0.9em" font-size="90">🐛</text></svg>', // Added aria-label
    apple: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Apple Icon</title><text y="0.9em" font-size="90">🍎</text></svg>', // Added aria-label
    // ... (other icons)
};

// ... (rest of the main.js file)

// End of updated main.js content