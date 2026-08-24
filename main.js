/**
 * Main JavaScript file
 * Handles UI interactions for the application
 */

(function() {
    'use strict';

    // Initialize the application
    function init() {
        setupRotateButton();
        setupOtherInteractions();
    }

    // Set up the rotate back button functionality
    function setupRotateButton() {
        const rotateContainer = document.getElementById('rotate-container');
        
        if (rotateContainer) {
            // Check if the old problematic link exists
            const existingLink = document.getElementById('unrotate');
            
            if (existingLink) {
                // Create a semantic button instead of <a href="#">
                const button = document.createElement('button');
                button.id = 'unrotate';
                button.textContent = 'rotate back';
                button.type = 'button';
                button.className = 'rotate-back-button';
                
                // Copy any existing attributes/styles if needed
                if (existingLink.className) {
                    button.className = existingLink.className;
                }
                
                // Replace the link with the button
                existingLink.replaceWith(button);
            }
        }
    }

    // Rotate content functionality
    function rotateContent() {
        const content = document.getElementById('rotatable-content');
        if (content) {
            const style = window.getComputedStyle(content);
            const matrix = new DOMMatrixReadOnly(style.transform);
            const currentRotation = Math.atan2(matrix.b, matrix.a) * (180 / Math.PI);
            const newRotation = currentRotation - 90;
            content.style.transform = `rotate(${newRotation}deg)`;
        }
    }

    // Set up other UI interactions
    function setupOtherInteractions() {
        const unrotateBtn = document.getElementById('unrotate');
        if (unrotateBtn) {
            unrotateBtn.addEventListener('click', function(e) {
                e.preventDefault();
                rotateContent();
            });
        }
    }

    // Run initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export functions for testing
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = {
            rotateContent,
            setupRotateButton,
            init
        };
    }
})();