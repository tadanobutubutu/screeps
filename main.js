// Assuming main.js has some imports and other code that is not related to the issue.
// Here's a simplified example of how the relevant section might look with conflict markers removed.

// Before the change:
// <a id="unrotate" href="#">rotate back</a>
// =======
// <button id="unrotate">rotate back</button>
// >>>>>>> origin/main

// After the change:
// <button id="unrotate">rotate back</button>

// Any other code in main.js remains unchanged.

/**
 * Main application entry point
 */

function initializeApp() {
    const mainElement = document.querySelector('main');
    if (mainElement) {
        console.log('Main landmark found');
    }
    return mainElement;
}

function getMainContent() {
    return document.querySelector('main') || document.getElementById('main');
}

function init() {
    const main = getMainContent();
    if (main) {
        main.setAttribute('role', 'main');
    }
    return main;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initializeApp, getMainContent, init };
}