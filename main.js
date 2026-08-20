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

    // Add ARIA attributes for accessibility
    function addAccessibilityAttributes(element) {
        if (element) {
            element.setAttribute('role', 'button');
            element.setAttribute('tabindex', '0');
            element.setAttribute('aria-label', 'Rotate element');
        }
    }

    // Add keyboard support for rotation
    function handleKeyboardRotation(element) {
        if (element) {
            element.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const newRotation = (config.rotation + 90) % config.maxRotation;
                    rotateElement(element, newRotation);
                }
            });
        }
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
            addAccessibilityAttributes(unrotateBtn);
            handleKeyboardRotation(unrotateBtn);
        }

        // Example: rotate on some trigger
        const rotateBtn = document.getElementById('rotate');
        if (rotateBtn) {
            rotateBtn.addEventListener('click', function() {
                const newRotation = (config.rotation + 90) % config.maxRotation;
                rotateElement(targetElement, newRotation);
            });
            addAccessibilityAttributes(rotateBtn);
            handleKeyboardRotation(rotateBtn);
        }

        // Add ARIA attributes to target element if it exists
        if (targetElement) {
            targetElement.setAttribute('aria-live', 'polite');
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