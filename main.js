// Main entry point for the Screeps project
(function() {
    'use strict';
    
    // Initialize the application
    function init() {
        console.log('Screeps application initialized');
    }
    
    // Run initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Export for module usage
    module.exports = { init };
})();