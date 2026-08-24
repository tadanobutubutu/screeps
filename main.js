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

// New function to add accessible name to SVGs
function addAccessibleNameToSVGs() {
    const svgs = document.querySelectorAll('svg');
    svgs.forEach(svg => {
        if (!svg.querySelector('title') && !svg.querySelector('aria-label') && !svg.getAttribute('aria-hidden')) {
            const title = document.createElement('title');
            title.textContent = 'SVG description';
            svg.appendChild(title);
        }
    });
}

document.addEventListener('DOMContentLoaded', addAccessibleNameToSVGs);