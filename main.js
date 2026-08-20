// Main JavaScript file with accessibility fix applied
// Fix: Changed <a href="#"> to <button> for the "rotate back" link

(function() {
    'use strict';

    // Store rotation state
    let currentRotation = 0;
    
    // Initialize the application
    function init() {
        const unrotateLink = document.getElementById('unrotate');
        if (unrotateLink) {
            // Create a button element to replace the fake link
            const unrotateButton = document.createElement('button');
            unrotateButton.id = 'unrotate';
            unrotateButton.textContent = 'rotate back';
            unrotateButton.className = unrotateLink.className;
            unrotateButton.setAttribute('aria-label', 'Rotate back to original position');
            
            // Copy inline styles if any
            if (unrotateLink.style.cssText) {
                unrotateButton.style.cssText = unrotateLink.style.cssText;
            }
            
            // Replace the link with button
            unrotateLink.parentNode.replaceChild(unrotateButton, unrotateLink);
            
            // Add click handler
            unrotateButton.addEventListener('click', function() {
                resetRotation();
            });
        }
        
        // Other initialization...
        setupEventListeners();
    }
    
    function setupEventListeners() {
        // Setup rotation controls if they exist
        const rotateLeft = document.getElementById('rotate-left');
        const rotateRight = document.getElementById('rotate-right');
        
        if (rotateLeft) {
            rotateLeft.addEventListener('click', function() {
                rotate(-90);
            });
        }
        
        if (rotateRight) {
            rotateRight.addEventListener('click', function() {
                rotate(90);
            });
        }
    }
    
    function rotate(degrees) {
        currentRotation += degrees;
        const image = document.querySelector('.rotatable-image');
        if (image) {
            image.style.transform = 'rotate(' + currentRotation + 'deg)';
        }
        
        // Show/hide the rotate back button
        const unrotateBtn = document.getElementById('unrotate');
        if (unrotateBtn) {
            unrotateBtn.style.display = currentRotation !== 0 ? 'inline-block' : 'none';
        }
    }
    
    function resetRotation() {
        currentRotation = 0;
        const image = document.querySelector('.rotatable-image');
        if (image) {
            image.style.transform = 'rotate(0deg)';
        }
        
        const unrotateBtn = document.getElementById('unrotate');
        if (unrotateBtn) {
            unrotateBtn.style.display = 'none';
        }
    }
    
    // Export functions for testing
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = {
            init: init,
            rotate: rotate,
            resetRotation: resetRotation
        };
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();