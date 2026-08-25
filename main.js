// main.js

// Existing code preserved
const img = document.querySelector('img'); // Assuming img is selected from DOM
let rotation = 0;

function rotate() {
    rotation += 90;
    img.style.transform = `rotate(${rotation}deg)`;
}

function rotateBack() {
    rotation = 0;
    img.style.transform = `rotate(0deg)`;
}

function toggleRotation() {
    rotation += rotation === 360 ? -360 : 90;
    img.style.transform = `rotate(${rotation}deg)`;
}

// New function: setupLandmarkRegions
function setupLandmarkRegions() {
    const header = document.createElement('header');
    header.setAttribute('role', 'banner');
    header.setAttribute('aria-label', 'Site header');

    const nav = document.createElement('nav');
    nav.setAttribute('role', 'navigation');
    nav.setAttribute('aria-label', 'Main navigation');

    const main = document.createElement('main');
    main.setAttribute('role', 'main');
    main.setAttribute('aria-label', 'Main content');

    const aside = document.createElement('aside');
    aside.setAttribute('role', 'complementary');
    aside.setAttribute('aria-label', 'Complementary content');

    const footer = document.createElement('footer');
    footer.setAttribute('role', 'contentinfo');
    footer.setAttribute('aria-label', 'Site footer');

    // Append landmark regions to the document body
    document.body.appendChild(header);
    document.body.appendChild(nav);
    document.body.appendChild(main);
    document.body.appendChild(aside);
    document.body.appendChild(footer);

    return { header, nav, main, aside, footer };
}

// New function: getSvgAccessibleName
function getSvgAccessibleName(svgElement) {
    if (!svgElement) return '';
    const title = svgElement.querySelector('title');
    if (title) {
        return title.textContent.trim();
    }
    const desc = svgElement.querySelector('desc');
    if (desc) {
        return desc.textContent.trim();
    }
    if (svgElement.hasAttribute('aria-label')) {
        return svgElement.getAttribute('aria-label').trim();
    }
    return '';
}

// Attach event listeners
document.querySelector('.rotate-btn').addEventListener('click', rotate);
document.querySelector('.rotate-back-btn').addEventListener('click', rotateBack);
// New event listener for the toggle rotation functionality
document.querySelector('.toggle-rotation-btn').addEventListener('click', toggleRotation);

// Initialize landmark regions
setupLandmarkRegions();

// Export the new functions if needed, otherwise preserve existing exports
export { rotate, rotateBack, toggleRotation, setupLandmarkRegions, getSvgAccessibleName };