// Preserve existing main.js code, don't modify it unless explicitly required by the issue.

// To add a new function, add it below the existing ones while preserving proper indentation.

// For instance, adding a new function named 'myFunction':
function myFunction() {
    // Your code here
}

// Add accessibility attributes to SVG elements
function makeSvgAccessible(svgElement) {
    if (svgElement && !svgElement.getAttribute('aria-hidden')) {
        svgElement.setAttribute('aria-hidden', 'true');
    }
}

// Initialize accessibility for SVGs when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const svgs = document.querySelectorAll('svg');
    svgs.forEach(svg => {
        makeSvgAccessible(svg);
    });
});