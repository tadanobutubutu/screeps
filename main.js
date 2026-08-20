// main.js - Handles interactive functionality for the application
(function() {
    'use strict';

    // DOM Ready handler
    function domReady(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    // Initialize the application
    function init() {
        // Handle unrotate button functionality (REACT_036: Fixed fake link issue)
        // Changed from <a id="unrotate" href="#"> to <button id="unrotate" type="button">
        const unrotateButton = document.getElementById('unrotate');
        if (unrotateButton && unrotateButton.tagName === 'BUTTON') {
            unrotateButton.addEventListener('click', function(e) {
                e.preventDefault();
                handleUnrotate();
            });
        }

        // Additional initialization can be added here
        initializeInteractiveElements();
    }

    // Handle rotate back functionality
    function handleUnrotate() {
        // Reset any rotation transforms on elements
        const rotatedElements = document.querySelectorAll('[data-rotated]');
        rotatedElements.forEach(function(element) {
            element.style.transform = '';
            element.removeAttribute('data-rotated');
        });

        // Dispatch custom event for other components to respond
        const event = new CustomEvent('rotateReset', {
            bubbles: true,
            detail: { timestamp: Date.now() }
        });
        document.dispatchEvent(event);
    }

    // Initialize other interactive elements
    function initializeInteractiveElements() {
        // Find all buttons and add proper click handlers
        const buttons = document.querySelectorAll('button');
        buttons.forEach(function(button) {
            if (!button.hasAttribute('data-initialized')) {
                button.setAttribute('data-initialized', 'true');
            }
        });
    }

    // Export functions for testing
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = {
            handleUnrotate: handleUnrotate,
            initializeInteractiveElements: initializeInteractiveElements,
            domReady: domReady
        };
    }

    // Initialize when DOM is ready
    domReady(init);
})();