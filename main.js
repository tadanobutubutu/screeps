// main.js

// Existing code preserved
import {
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    getLangAttribute,
    getFullLangAttribute,
    validateUniqueLandmarks,
    createInPageButton,
    createAccessibleLink,
    getSvgAccessibleName
} from './accessibility-utils.js';

const img = ... // Assuming img is selected from DOM
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

// New function: createLandmarkRegions
function createLandmarkRegions() {
    // Use imported modules for validation
    
    const header = document.createElement('header');
    header.setAttribute('role', 'banner');
    header.setAttribute('aria-label', 'Site header');
    
    // Validate landmark using imported module
    validateLandmark(header, 'banner');

    const nav = document.createElement('nav');
    nav.setAttribute('role', 'navigation');
    nav.setAttribute('aria-label', 'Main navigation');
    validateLandmark(nav, 'navigation');

    const main = document.createElement('main');
    main.setAttribute('role', 'main');
    main.setAttribute('aria-label', 'Main content');
    validateLandmark(main, 'main');

    const aside = document.createElement('aside');
    aside.setAttribute('role', 'complementary');
    aside.setAttribute('aria-label', 'Complementary content');
    validateLandmark(aside, 'complementary');

    const footer = document.createElement('footer');
    footer.setAttribute('role', 'contentinfo');
    footer.setAttribute('aria-label', 'Site footer');
    validateLandmark(footer, 'contentinfo');

    // Use getLangAttribute from imported modules
    const langAttribute = getLangAttribute();
    if (langAttribute) {
        document.documentElement.lang = langAttribute;
    }

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
    if (svgElement.getAttribute('aria-label')) {
        return svgElement.getAttribute('aria-label');
    }
    return '';
}

// New function: validateUniqueLandmarks
function validateUniqueLandmarks(container) {
    const landmarks = container.querySelectorAll('header[role="banner"], nav, main, aside[role="complementary"], footer[role="contentinfo"]');
    const roleCounts = {};
    
    landmarks.forEach(element => {
        const role = element.getAttribute('role') || element.tagName.toLowerCase();
        roleCounts[role] = (roleCounts[role] || 0) + 1;
    });
    
    // Ensure only one of each landmark type
    Object.keys(roleCounts).forEach(role => {
        if (roleCounts[role] > 1) {
            console.warn(`Multiple ${role} landmarks found`);
        }
    });
}

// New event listener for the toggle rotation functionality
img.addEventListener('click', toggleRotation);

// Initialize landmark regions
createLandmarkRegions();

// Export the new functions if needed, otherwise preserve existing exports
export { 
    rotate, 
    rotateBack, 
    toggleRotation, 
    createLandmarkRegions, 
    getSvgAccessibleName,
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    getLangAttribute,
    getFullLangAttribute,
    validateUniqueLandmarks,
    createInPageButton,
    createAccessibleLink
};