// main.js - Update to fix REACT_036 React Fake Link issue and additional bug fixes (integrated changes)

// Function to rotate image by given degrees
function rotateImage(imageId, degrees) {
    const img = document.getElementById(imageId);
    if (img) {
        // Use transform property to rotate the image
        img.style.transform = `rotate(${degrees}deg)`;
    }
}

// Function to create and initialize an unrotate button
function createUnrotateButton() {
    const button = document.createElement('button');
    button.id = 'unrotate';
    button.type = 'button';
    button.textContent = 'rotate back';
    button.addEventListener('click', function() {
        rotateImage('myImage', 0); // Rotate the image back to its original position
    });
    return button;
}

// Function to initialize the controls by adding the created unrotate button to the container
function init() {
    const container = document.getElementById('controls');
    if (container) {
        container.appendChild(createUnrotateButton());
    }
}

// Check if the DOM is fully loaded and then initialize the controls
document.addEventListener('DOMContentLoaded', init);

// Export the rotateImage, createUnrotateButton, and init functions
module.exports = { rotateImage, createUnrotateButton, init };