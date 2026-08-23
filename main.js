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

// Changes requested in the issue
function addAccessibleNameToSVG() {
    const svgElements = document.querySelectorAll('svg');
    svgElements.forEach(svg => {
        if (!svg.querySelector('title') && !svg.getAttribute('aria-label') && !svg.getAttribute('aria-hidden')) {
            const title = document.createElement('title');
            title.textContent = 'Accessible description of SVG content';
            svg.appendChild(title);
        }
    });
}

// Call the function to add accessible names to all SVG elements on the page
addAccessibleNameToSVG();