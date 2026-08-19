// main.js - Updated to fix REACT_041 accessibility warning

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

// Add this function to handle SVG accessibility
function makeSVGsAccessible() {
    // Find all SVG elements in the document
    const svgs = document.querySelectorAll('svg');

    // Add aria-hidden="true" to each SVG if it's decorative
    svgs.forEach(svg => {
        // Check if the SVG has any meaningful content or is just decorative
        if (!svg.querySelector('title, desc, text') && !svg.getAttribute('aria-label')) {
            svg.setAttribute('aria-hidden', 'true');
        }
    });
}

// Call the function when the DOM is loaded
document.addEventListener('DOMContentLoaded', makeSVGsAccessible);