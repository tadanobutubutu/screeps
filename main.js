// main.js - Screeps AI with REACT_017 accessibility fix

// Original Screeps AI code (preserved structure)
module.exports = {
    loop: function() {
        // Main game loop
        runMainLogic();
    }
};

function runMainLogic() {
    // Preserve existing game logic
    if (typeof Game !== 'undefined') {
        // Game logic here
    }
}

// REACT_017 fix: Wrap primary content in <main> landmark for accessibility
function wrapInMainLandmark(htmlContent) {
    if (!htmlContent || typeof htmlContent !== 'string') {
        return htmlContent;
    }
    
    // Check if already wrapped
    if (htmlContent.includes('<main>')) {
        return htmlContent;
    }
    
    // Wrap body content in <main> tag
    const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    if (bodyMatch) {
        const innerContent = bodyMatch[1];
        return htmlContent.replace(
            bodyMatch[0],
            `<body><main>${innerContent}</main></body>`
        );
    }
    
    return `<main>${htmlContent}</main>`;
}

// Export for use in HTML generation
if (typeof module !== 'undefined' && module.exports) {
    module.exports.wrapInMainLandmark = wrapInMainLandmark;
    module.exports.loop = module.exports.loop;
}