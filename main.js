// main.js

// TODO: Implement this function for setting accessible names to SVGs
function setAccessibleName(svg, name) {
    // Ensure the SVG has role="img" for accessibility
    if (!svg.getAttribute('role')) {
        svg.setAttribute('role', 'img');
    }

    // Set aria-label with the provided name
    svg.setAttribute('aria-label', name);

    // Add or update a title element inside the SVG for screen readers
    let title = svg.querySelector('title');
    if (!title) {
        title = document.createElement('title');
        title.id = 'svg-title-' + Math.random().toString(36).substr(2, 9);
        svg.insertBefore(title, svg.firstChild);
    }
    title.textContent = name;

    // Link the title using aria-labelledby
    svg.setAttribute('aria-labelledby', title.id);
}