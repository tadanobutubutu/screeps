// main.js - Updated to fix REACT_036 and REACT_041 accessibility warnings

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

// Add accessibility attributes to any SVGs that might exist
document.addEventListener('DOMContentLoaded', function() {
    // Find all SVG elements in the document
    const svgs = document.querySelectorAll('svg');

    svgs.forEach(svg => {
        // If SVG is decorative, mark it as hidden
        if (svg.getAttribute('aria-hidden') !== 'true') {
            // Check if it has an accessible name
            const hasTitle = svg.querySelector('title') !== null;
            const hasLabel = svg.getAttribute('aria-label') !== null;

            // If no accessible name, add one
            if (!hasTitle && !hasLabel) {
                // For favicon-like SVGs, add aria-hidden
                if (svg.closest('link[rel="icon"]')) {
                    svg.setAttribute('aria-hidden', 'true');
                } else {
                    // For other SVGs, add a title
                    const title = document.createElement('title');
                    title.textContent = 'Graphic element';
                    svg.insertBefore(title, svg.firstChild);
                }
            }
        }
    });
});