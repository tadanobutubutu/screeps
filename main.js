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
        const targetElement = document.getElementById('target');
        const unrotateBtn = document.getElementById('unrotate');

        // Handle the rotate back button click
        if (unrotateBtn) {
            unrotateBtn.addEventListener('click', function(e) {
                e.preventDefault();
                resetRotation(targetElement);
            });
        }

        // Example: rotate on some trigger
        const rotateBtn = document.getElementById('rotate');
        if (rotateBtn) {
            rotateBtn.addEventListener('click', function() {
                const newRotation = (config.rotation + 90) % config.maxRotation;
                rotateElement(targetElement, newRotation);
            });
        }

        // Add scope attributes to table headers for accessibility
        const tableHeaders = document.querySelectorAll('th');
        tableHeaders.forEach(header => {
            if (!header.hasAttribute('scope')) {
                // Determine if this is a column or row header based on context
                // For this example, we'll assume all are column headers
                header.setAttribute('scope', 'col');
            }
        });
    });

    // Export functions for testing or external use
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = {
            rotateElement,
            resetRotation
        };
    }
})();