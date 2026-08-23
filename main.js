// main.js

// Existing code preserved
const img = document.getElementById('target');
let rotation = 0;

function rotate() {
    rotation += 90;
    img.style.transform = `rotate(${rotation}deg)`;
}

function rotateBack() {
    rotation = 0;
    img.style.transform = `rotate(0deg)`;
}

// Attach event listeners
document.getElementById('rotate').addEventListener('click', rotate);
document.getElementById('unrotate').addEventListener('click', rotateBack);

// New function to make the image focusable for screen readers
function makeImageFocusable() {
    img.setAttribute('tabindex', '0');
    img.setAttribute('role', 'img');
    img.setAttribute('aria-label', 'Rotatable image');
}

// Call the function to make the image focusable
makeImageFocusable();