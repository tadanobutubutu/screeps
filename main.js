// Game loop for Screeps
module.exports.loop = function () {
    // Placeholder for game logic
    if (Game.spawns['Spawn1']) {
        // Spawn logic can go here
    }
};

/**
 * Checks the accessibility of links and buttons in a document.
 * Logs warnings to the console for elements that may have accessibility issues.
 * @param {Document} document - The document to check.
 */
function checkLinkAndButtonAccessibility(document) {
    if (!document) {
        console.log('No document provided for accessibility check.');
        return;
    }

    // Check links
    const links = document.querySelectorAll('a');
    links.forEach((link) => {
        if (!link.textContent.trim() && !link.getAttribute('aria-label')) {
            console.log('Link without accessible text or aria-label:', link);
        }
        if (link.getAttribute('target') === '_blank' && !link.getAttribute('rel')) {
            console.log('Link with target="_blank" missing rel attribute:', link);
        }
    });

    // Check buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach((button) => {
        if (!button.textContent.trim() && !button.getAttribute('aria-label')) {
            console.log('Button without accessible text or aria-label:', button);
        }
    });
}