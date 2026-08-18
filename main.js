// main.js - Image Rotation Handler

/**
 * Rotates an image by the specified degree
 * @param {string} imageId - The ID of the image element
 * @param {number} degrees - Degrees to rotate (positive = clockwise)
 */
function rotateImage(imageId, degrees) {
    const img = document.getElementById(imageId);
    if (!img) return;
    
    const currentTransform = img.style.transform || '';
    const match = currentTransform.match(/rotate\(([-\d.]+)deg\)/);
    const currentDegrees = match ? parseInt(match[1], 10) : 0;
    const newDegrees = currentDegrees + degrees;
    
    img.style.transform = `rotate(${newDegrees}deg)`;
}

// Initialize rotation functionality
document.addEventListener('DOMContentLoaded', () => {
    // Rotate back button - use button element for in-page actions
    const unrotateBtn = document.getElementById('unrotate');
    if (unrotateBtn) {
        unrotateBtn.addEventListener('click', () => {
            const img = document.getElementById('target-image');
            if (img) {
                img.style.transform = 'rotate(0deg)';
            }
        });
    }
});

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { rotateImage };
}