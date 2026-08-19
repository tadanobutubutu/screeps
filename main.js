// main.js - Updated to fix REACT_025 accessibility warning

// Initialize rotation state
let isRotated = false;

// Handle rotate button click
document.getElementById('rotate').addEventListener('click', function() {
    const content = document.getElementById('content');
    if (isRotated) {
        content.style.transform = 'rotate(0deg)';
        isRotated = false;
    } else {
        content.style.transform = 'rotate(90deg)';
        isRotated = true;
    }
});

// Handle unrotate button click (using button element for accessibility)
document.getElementById('unrotate').addEventListener('click', function() {
    const content = document.getElementById('content');
    content.style.transform = 'rotate(0deg)';
    isRotated = false;
});

// Sample content
const content = document.getElementById('content');
if (content) {
    content.innerHTML = `
        <h1>Welcome to the App</h1>
        <p>Click the rotate button to rotate the content.</p>
        <button id="rotate">Rotate</button>
        <button id="unrotate">rotate back</button>
    `;
}

// Function to ensure only one main element exists in the document
function ensureSingleMainElement() {
    const mainElements = document.getElementsByTagName('main');
    if (mainElements.length > 1) {
        // Keep the first main element and remove others
        for (let i = 1; i < mainElements.length; i++) {
            mainElements[i].remove();
        }
    }
}

// Run the function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', ensureSingleMainElement);