// Main application logic

function rotateImage(imageElement, degrees) {
    if (!imageElement || typeof degrees !== 'number') {
        return;
    }
    imageElement.style.transform = `rotate(${degrees}deg)`;
}

function setupUnrotateButton() {
    const unrotateBtn = document.getElementById('unrotate');
    const image = document.getElementById('target-image');
    
    if (unrotateBtn && image) {
        unrotateBtn.addEventListener('click', function() {
            image.style.transform = 'rotate(0deg)';
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    setupUnrotateButton();
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { rotateImage, setupUnrotateButton };
}