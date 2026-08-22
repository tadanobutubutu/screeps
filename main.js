/**
 * Main entry point for the application
 * Handles page initialization and landmark management
 */

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Ensure main landmark exists for accessibility
    ensureMainLandmark();
}

function ensureMainLandmark() {
    // Check if main landmark already exists
    const existingMain = document.querySelector('main');
    
    if (!existingMain) {
        // Wrap the primary content in a main landmark for accessibility
        const primaryContent = document.getElementById('table-rotated') || 
                              document.querySelector('.container') ||
                              document.querySelector('table') ||
                              document.body.firstElementChild;
        
        if (primaryContent && primaryContent.parentNode) {
            const mainElement = document.createElement('main');
            primaryContent.parentNode.insertBefore(mainElement, primaryContent);
            mainElement.appendChild(primaryContent);
        }
    }
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initializeApp, ensureMainLandmark };
}