// main.js - Updated to fix REACT_036 React Fake Link issue

function rotateImage(imageId, degrees) {
    const img = document.getElementById(imageId);
    if (img) {
        img.style.transform = `rotate(${degrees}deg)`;
    }
}

function createUnrotateButton() {
    const button = document.createElement('button');
    button.id = 'unrotate';
    button.type = 'button';
    button.textContent = 'rotate back';
    button.addEventListener('click', function() {
        rotateImage('myImage', 0);
    });
    return button;
}

function init() {
    const container = document.getElementById('controls');
    if (container) {
        container.appendChild(createUnrotateButton());
    }
}

document.addEventListener('DOMContentLoaded', init);

module.exports = { rotateImage, createUnrotateButton, init };