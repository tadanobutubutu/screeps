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
            // Add ARIA live region for screen reader announcements
            const liveRegion = document.getElementById('a11y-live-region');
            if (liveRegion) {
                liveRegion.textContent = `Element rotated to ${degrees} degrees`;
            }
        }
    }

    // Function to reset rotation
    function resetRotation(element) {
        rotateElement(element, 0);
    }

    // Function to add ARIA attributes to buttons
    function addButtonAccessibility(button, label) {
        if (button) {
            button.setAttribute('aria-label', label);
            button.setAttribute('role', 'button');
        }
    }

    // Initialize on DOM ready
    document.addEventListener('DOMContentLoaded', function() {
        const targetElement = document.getElementById('target');
        const unrotateBtn = document.getElementById('unrotate');
        const rotateBtn = document.getElementById('rotate');

        // Add ARIA attributes to buttons
        addButtonAccessibility(unrotateBtn, 'Reset rotation');
        addButtonAccessibility(rotateBtn, 'Rotate element');

        // Create live region for accessibility announcements
        const liveRegion = document.createElement('div');
        liveRegion.id = 'a11y-live-region';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.style.position = 'absolute';
        liveRegion.style.width = '1px';
        liveRegion.style.height = '1px';
        liveRegion.style.padding = '0';
        liveRegion.style.overflow = 'hidden';
        liveRegion.style.clip = 'rect(0, 0, 0, 0)';
        liveRegion.style.whiteSpace = 'nowrap';
        liveRegion.style.border = '0';
        document.body.appendChild(liveRegion);

        // Handle the rotate back button click
        if (unrotateBtn) {
            unrotateBtn.addEventListener('click', function(e) {
                e.preventDefault();
                resetRotation(targetElement);
            });
        }

        // Example: rotate on some trigger
        if (rotateBtn) {
            rotateBtn.addEventListener('click', function() {
                const newRotation = (config.rotation + 90) % config.maxRotation;
                rotateElement(targetElement, newRotation);
            });
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