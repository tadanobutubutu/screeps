// main.js - Image/Canvas rotation functionality

// State
let rotation = 0;
const MAX_ROTATION = 360;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

/**
 * Rotates the canvas by the specified degrees
 * @param {number} degrees - The number of degrees to rotate
 */
function rotateCanvas(degrees) {
    rotation = (rotation + degrees) % MAX_ROTATION;
    renderCanvas();
}

/**
 * Resets the canvas rotation to 0
 */
function resetRotation() {
    rotation = 0;
    renderCanvas();
}

/**
 * Renders the canvas with current rotation
 */
function renderCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    
    // Draw a sample shape
    ctx.fillStyle = '#4287f5';
    ctx.fillRect(-50, -50, 100, 100);
    
    ctx.restore();
    
    // Update unrotate button visibility
    const unrotateBtn = document.getElementById('unrotate');
    if (unrotateBtn) {
        unrotateBtn.style.display = rotation === 0 ? 'none' : 'inline-block';
    }
}

/**
 * Initializes the application
 */
function init() {
    renderCanvas();
    
    // Rotate controls
    document.getElementById('rotate-left')?.addEventListener('click', () => rotateCanvas(-90));
    document.getElementById('rotate-right')?.addEventListener('click', () => rotateCanvas(90));
    
    // Reset rotation - FIXED: Changed from <a href="#"> to <button type="button">
    document.getElementById('unrotate')?.addEventListener('click', resetRotation);
}

document.addEventListener('DOMContentLoaded', init);

module.exports = { rotateCanvas, resetRotation, renderCanvas, init };