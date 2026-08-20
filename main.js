// Main application logic

/**
 * Rotates an element by the specified angle
 * @param {HTMLElement} element - The element to rotate
 * @param {number} angle - The angle in degrees
 */
function rotateElement(element, angle) {
    if (element) {
        element.style.transform = `rotate(${angle}deg)`;
        element.setAttribute('data-rotated', angle);
    }
}

/**
 * Resets the rotation of an element
 * @param {HTMLElement} element - The element to reset
 */
function resetRotation(element) {
    if (element) {
        element.style.transform = 'rotate(0deg)';
        element.removeAttribute('data-rotated');
    }
}

/**
 * Initializes the rotation controls
 * @param {string} targetId - The ID of the element to rotate
 * @param {string} controlId - The ID of the control element
 */
function initializeRotation(targetId, controlId) {
    const target = document.getElementById(targetId);
    const control = document.getElementById(controlId);
    let currentRotation = 0;
    
    if (control && target) {
        // Fix: Changed from <a href="#"> to <button> for proper accessibility
        control.addEventListener('click', function(e) {
            e.preventDefault();
            currentRotation += 90;
            if (currentRotation >= 360) {
                currentRotation = 0;
                resetRotation(target);
                control.textContent = 'rotate back';
            } else {
                rotateElement(target, currentRotation);
                control.textContent = `reset (${currentRotation}°)`;
            }
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeRotation('rotatable', 'unrotate');
});

module.exports = {
    rotateElement,
    resetRotation,
    initializeRotation
};