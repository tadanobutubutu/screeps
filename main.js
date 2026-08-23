(function() {
    'use strict';

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    let rotation = 0;
    let scale = 1;
    let currentImage = null;

    // Load and initialize the image
    function loadImage(src) {
        const img = new Image();
        img.onload = function() {
            currentImage = img;
            canvas.width = img.width;
            canvas.height = img.height;
            drawImage();
        };
        img.src = src;
    }

    // Draw the image with current transformations
    function drawImage() {
        if (!currentImage) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        
        // Move to center, apply transformations, move back
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        ctx.translate(centerX, centerY);
        ctx.rotate(rotation);
        ctx.scale(scale, scale);
        ctx.translate(-centerX, -centerY);
        
        ctx.drawImage(currentImage, 0, 0);
        ctx.restore();
    }

    // Rotate the image clockwise
    function rotate() {
        rotation += Math.PI / 2;
        drawImage();
    }

    // Flip the image horizontally
    function flip() {
        scale *= -1;
        drawImage();
    }

    // Attach event listeners to buttons
    function init() {
        // Original navigation buttons (external links - OK to keep as <a>)
        const flipBtn = document.getElementById('flip');
        if (flipBtn) {
            flipBtn.addEventListener('click', function(e) {
                e.preventDefault();
                flip();
            });
        }

        // Fixed: Changed from <a href="#"> to <button> for in-page action
        const unrotateBtn = document.getElementById('unrotate');
        if (unrotateBtn) {
            unrotateBtn.addEventListener('click', function(e) {
                e.preventDefault();
                rotation = 0;
                scale = 1;
                drawImage();
            });
        }

        // Example of rotating back link that was causing the issue
        // Now properly implemented as a button
        const rotateBackLink = document.getElementById('unrotate');
        if (rotateBackLink && rotateBackLink.tagName === 'BUTTON') {
            // Already a button, no action needed
        }
    }

    // Export functions for testing
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = {
            loadImage,
            drawImage,
            rotate,
            flip,
            rotateBack: function() {
                rotation = 0;
                scale = 1;
                drawImage();
            },
            init
        };
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();