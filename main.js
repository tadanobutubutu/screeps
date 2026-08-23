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

// New code to be added:
function toggleRotation() {
    rotation += rotation === 360 ? -360 : 90;
    img.style.transform = `rotate(${rotation}deg)`;
}

// Attach event listeners
document.getElementById('rotate').addEventListener('click', rotate);
document.getElementById('unrotate').addEventListener('click', rotateBack);
// New event listener for the toggle rotation functionality
document.getElementById('toggle-rotate').addEventListener('click', toggleRotation);

// Export the new function if needed, otherwise preserve existing exports
// export { rotate, rotateBack, toggleRotation };