// main.js

function getAccessibleSVG(iconName) {
    switch (iconName) {
        case 'icon':
            return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y=".9em" font-size="90">🐛</text></svg>';
        case 'apple':
            return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Apple Icon</title><text y=".9em" font-size="90">🍎</text></svg>';
        default:
            return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"></svg>';
    }
}

const icons = {
    icon: getAccessibleSVG('icon'),
    apple: getAccessibleSVG('apple'),
};

// Rest of the code remains the same

// ... (existing code)

export { getAccessibleSVG, getHeadingLevels, addressIssuesFromInsightReport };