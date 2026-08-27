// main.js - Main entry point for the application

// Initialize application
function initApp() {
    console.log('Application initialized');
    
    // Check if main landmark exists for accessibility
    const mainElement = document.querySelector('main');
    if (!mainElement) {
        console.warn('REACT_017: Page has no <main> landmark');
    }
    
    // Initialize components
    initNavigation();
    initTableHandlers();
}

// Navigation initialization
function initNavigation() {
    const nav = document.querySelector('nav');
    if (nav) {
        console.log('Navigation initialized');
    }
}

// Table handlers initialization
function initTableHandlers() {
    const table = document.getElementById('table-rotated');
    if (table) {
        console.log('Table handlers initialized');
    }
}

// Export functions for testing
module.exports = {
    initApp,
    initNavigation,
    initTableHandlers
};

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', initApp);
}