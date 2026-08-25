// main.js

// Assuming that the `icons` object is part of the code that's causing the issue
// and needs to be modified to include an accessible name for the SVG.

const icons = {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><title>Screeps Dashboard</title><text y=%22.9em%22 font-size=%2290%22>🐛</text></svg>',
    apple: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐛</text></svg>',
};

// To resolve the issue, we will wrap the SVG content in a function to avoid
// breaking any existing functionality, and we will include an accessible name.
function getAccessibleSVG(iconName) {
    switch (iconName) {
        case 'icon':
            return 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><title>Screeps Dashboard</title><text y=%22.9em%22 font-size=%2290%22>🐛</text></svg>';
        case 'apple':
            return 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><title>Apple Icon</title><text y=%22.9em%22 font-size=%2290%22>🍎</text></svg>';
        default:
            return 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22></svg>';
    }
}

// Reassign the icons object to use the new function
icons.icon = getAccessibleSVG('icon');
icons.apple = getAccessibleSVG('apple');

// The rest of the main.js file would follow, and existing code should not be altered.