// Main application entry point
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

// Function to remove duplicate <main> elements and ensure only one <main> is present
function ensureSingleMain() {
    const allMainElements = document.querySelectorAll('main');
    if (allMainElements.length > 1) {
        // Remove all but the first <main> element
        allMainElements.slice(1).forEach((main) => {
            main.remove();
        });
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initializeApp, getMainContent, init, ensureSingleMain };
}