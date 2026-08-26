// Main entry point for the Screeps project
(function() {
    'use strict';
    
    // Initialize the application
    function init() {
        console.log('Screeps application initialized');
    }
    
    // Add main landmark for accessibility (REACT_017)
    function addMainLandmark() {
        const main = document.createElement('main');
        main.setAttribute('id', 'main-content');
        main.setAttribute('role', 'main');
        
        // Move the body's existing content into <main>
        while (document.body.firstChild) {
            main.appendChild(document.body.firstChild);
        }
        document.body.appendChild(main);
    }
    
    // Run initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            addMainLandmark();
            init();
        });
    } else {
        addMainLandmark();
        init();
    }
    
    // Export for module usage
    module.exports = { init, addMainLandmark };
})();