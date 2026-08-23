function setupSVGIcons() { // Define a function to create an accessible SVG element
    function createAccessibleSVG(iconData, label) {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <title>${label}</title>
            ${iconData}
        </svg>`;
    }

    // Replace the SVG creation with the accessible version
    const icons = {
        icon: createAccessibleSVG(
            'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="0.9em" font-size="90">🐛</text></svg>',
            'Screeps Dashboard Icon'
        ),
        apple: createAccessibleSVG(
            'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="0.9em" font-size="90">🐛</text></svg>',
            'Apple Icon'
        )
        // ... other icons ...
    };

    // ... other code ...

    // Call the function to set up the icons
    setupSVGIcons(); // ... existing code ...
}

// Call the function to set up the icons
setupSVGIcons(); // ... existing code ...