// Set the document language to English
document.documentElement.lang = 'en';

// Main application logic

/**
 * Rotates an element back to its original state
 */
function unrotate() {
    // Rotation reset logic
    const element = document.getElementById('unrotate');
    if (element) {
        element.style.transform = 'rotate(0deg)';
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const unrotateButton = document.getElementById('unrotate');
    if (unrotateButton) {
        unrotateButton.addEventListener('click', function(e) {
            e.preventDefault();
            unrotate();
        });
    }
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { unrotate };
}