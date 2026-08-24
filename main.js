// ... other code ...

// Assuming `generateFavicon` is a function that returns the SVG string
function generateFavicon(iconType) {
    // ... existing code to generate the SVG ...

    // Add a title element to the SVG for accessibility
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <title>Screeps Favicon</title>
        ${innerSVGContent} <!-- Inner SVG content remains the same -->
    </svg>`;
}

// ... other code ...

// Example usage in the code where icons are set:
icons = {
    icon: generateFavicon('icon'),
    apple: generateFavicon('apple'),
    // ... other icons ...
};

// ... other code ...