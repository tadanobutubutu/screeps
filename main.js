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

// Add ARIA attributes to SVGs in layout files (would be in layout.tsx files)
function addSvgAccessibility() {
    // For favicon SVG (dashboard/app/layout.tsx)
    const faviconSvg = document.querySelector('svg[aria-hidden="true"]');
    if (faviconSvg) {
        faviconSvg.setAttribute('aria-hidden', 'true');
    }

    // For metadata SVG (app/layout.tsx)
    const metadataSvg = document.querySelector('svg:not([aria-hidden="true"])');
    if (metadataSvg) {
        // Add title element for accessible name
        const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        title.textContent = 'Application logo';
        metadataSvg.insertBefore(title, metadataSvg.firstChild);
    }
}

// Call the function when DOM is loaded
document.addEventListener('DOMContentLoaded', addSvgAccessibility);