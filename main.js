// main.js
(function() {
    'use strict';

    // Some existing configuration or state
    const config = {
        rotation: 0,
        maxRotation: 360
    };

    // Function to rotate an element
    function rotateElement(element, degrees) {
        if (element) {
            element.style.transform = `rotate(${degrees}deg)`;
            config.rotation = degrees;
        }
    }

    // Function to reset rotation
    function resetRotation(element) {
        rotateElement(element, 0);
    }

    // Initialize on DOM ready
    document.addEventListener('DOMContentLoaded', function() {
        const targetElement = document.querySelector('.rotate-target');
        const unrotateBtn = document.querySelector('.unrotate-btn');

        // Handle the rotate back button click
        if (unrotateBtn) {
            unrotateBtn.addEventListener('click', function(e) {
                e.preventDefault();
                resetRotation(targetElement);
            });
        }

        // Example: rotate on some trigger
        const rotateBtn = document.querySelector('.rotate-btn');
        if (rotateBtn) {
            rotateBtn.addEventListener('click', function() {
                const newRotation = (config.rotation + 90) % config.maxRotation;
                rotateElement(targetElement, newRotation);
            });
        }

        // Ensure the document has a lang attribute for accessibility (REACT_015)
        if (document.documentElement && !document.documentElement.hasAttribute('lang')) {
            document.documentElement.setAttribute('lang', 'en');
        }
    });

    // Export functions for testing or external use
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = {
            rotateElement,
            resetRotation
        };
    }
})();