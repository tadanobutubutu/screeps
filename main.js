// Rotate back button implementation
function setupUnrotate() {
    const unrotate = document.getElementById('unrotate');
    if (unrotate) {
        unrotate.addEventListener('click', function() {
            // Reset rotation to original state
            document.body.style.transform = 'rotate(0deg)';
        });
    }
}

// Add language attribute to HTML element for better screen reader support
function setDocumentLanguage() {
    document.documentElement.lang = 'en'; // Default to English, adjust as needed
}

// Add ARIA attributes to tables for better accessibility
function enhanceTables() {
    const tables = document.querySelectorAll('table');
    tables.forEach((table, index) => {
        if (!table.getAttribute('aria-label')) {
            table.setAttribute('aria-label', `Table ${index + 1}`);
        }
        if (!table.getAttribute('role')) {
            table.setAttribute('role', 'table');
        }
    });
}

// Add landmark roles for better screen reader navigation
function addLandmarks() {
    const main = document.querySelector('main');
    if (main && !main.getAttribute('role')) {
        main.setAttribute('role', 'main');
    }

    const header = document.querySelector('header');
    if (header && !header.getAttribute('role')) {
        header.setAttribute('role', 'banner');
    }

    const footer = document.querySelector('footer');
    if (footer && !footer.getAttribute('role')) {
        footer.setAttribute('role', 'contentinfo');
    }
}

// Initialize all accessibility enhancements
function initAccessibility() {
    setDocumentLanguage();
    enhanceTables();
    addLandmarks();
}

document.addEventListener('DOMContentLoaded', function() {
    setupUnrotate();
    initAccessibility();
});