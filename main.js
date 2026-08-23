const { icons } = require('./icons'); // Existing imports preserved

// Add this function to handle SVGs with aria-labels for accessibility
function withAriaLabel(svgContent, label = 'Favicon') {
    const titleRegex = /<title>.*?<\/title>/im;
    if (titleRegex.test(svgContent)) return svgContent; // Keep existing title if present
    return svgContent.replace('>', `aria-label="${label}" style="display:none;" >`);
}

// Modify the favicon SVG generation to include accessibility labels
icons.favicon.screeps = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <title>Aria-labeled Screeps Favicon</title>
    <text y=".9em" font-size="90" aria-hidden="true">🐛</text>
</svg>`;

// Existing/updated icons configuration preserved
icons.dashboard = {
    title: {
        icon: withAriaLabel(`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                <title>Aria Dashboard</title>
                <text y=".9em" font-size="90">🐛</text>
            </svg>
        `),
        color: '#222',
        colormod: '#eee'
    },
    cog: {
        icon: withAriaLabel(`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                <title>Aria Cogwheel</title>
                <circle cx="50" cy="50" r="45" />
                <circle cx="50" cy="50" r="40" />
                <line x1="20" y1="80" x2="80" y2="80" stroke="black" stroke-width="3" />
                <line x1="18" y1="76" x2="80" y2="76" stroke="black" stroke-width="3" />
                <line x1="22" y1="70" x2="80" y2="70" stroke="black" stroke-width="3" />
            </svg>
        `),
        color: '#222',
        colormod: '#eee'
    }
};

// Continue with existing icon configurations unchanged...
// ...preserving all unchanged exports and functions below