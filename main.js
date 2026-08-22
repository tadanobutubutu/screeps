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

// Adding lang attribute to the <html> element
document.documentElement.setAttribute('lang', 'en');