// Other code remains unchanged
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

// New accessibility fix functions
function addAccessibleLabels() {
    // Add aria-label to SVGs in layout.tsx (favicon)
    const favicon = document.querySelector('.favicon');
    if (favicon) {
        favicon.setAttribute('aria-label', 'Screeps Dashboard');
    }
}

function addImageLabels() {
    // Add aria-label to image components (Assuming there's an image component elsewhere)
    const images = document.querySelectorAll('img[src$="bug.png"]');
    images.forEach(img => {
        img.setAttribute('aria-label', 'Screeps Bug Icon');
    });
}

// Keep existing exports
module.exports = {
    initializeApp,
    getMainContent,
    init,
    addAccessibleLabels,
    addImageLabels
};