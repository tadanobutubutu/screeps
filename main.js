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

// Add ARIA attributes to SVGs in layout files (these would be in the actual layout.tsx files)
function addSvgAccessibility() {
    // For favicon SVG (dashboard/app/layout.tsx)
    const faviconSvg = document.querySelector('link[rel="icon"] + svg');
    if (faviconSvg) {
        faviconSvg.setAttribute('aria-hidden', 'true');
    }

    // For metadata SVG (app/layout.tsx)
    const metadataSvg = document.querySelector('meta[name="viewport"] + svg');
    if (metadataSvg) {
        metadataSvg.setAttribute('aria-label', 'Application icon');
    }
}

// Call the function when DOM is loaded
document.addEventListener('DOMContentLoaded', addSvgAccessibility);