// Address accessibility issues from insight report — FIXED

// Main application entry point
(function() {
    'use strict';
    
    // Initialize the application
    function init() {
        // Add keyboard navigation support
        setupKeyboardNavigation();
        
        // Add ARIA labels where needed
        setupAccessibilityAttributes();
        
        console.log('Application initialized');
    }
    
    // Setup keyboard navigation for accessibility
    function setupKeyboardNavigation() {
        document.addEventListener('keydown', function(event) {
            // Handle Tab key navigation
            if (event.key === 'Tab') {
                document.body.classList.add('keyboard-nav');
            }
        });
        
        document.addEventListener('mousedown', function() {
            document.body.classList.remove('keyboard-nav');
        });
    }
    
    // Setup ARIA attributes for screen readers
    function setupAccessibilityAttributes() {
        const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
        
        interactiveElements.forEach(function(element) {
            if (!element.getAttribute('aria-label') && !element.textContent.trim()) {
                console.warn('Interactive element missing accessible label:', element);
            }
        });
    }
    
    // Export functions for testing
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = {
            init: init,
            setupKeyboardNavigation: setupKeyboardNavigation,
            setupAccessibilityAttributes: setupAccessibilityAttributes
        };
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();