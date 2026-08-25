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
    createAccessibleLink
} from './accessibility-utils.js';

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
    // Use imported modules for validation
    validateUniqueLandmarks();
    
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
        document.documentElement.setAttribute('lang', langAttribute);
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
    if (svgElement.hasAttribute('aria-label')) {
        return svgElement.getAttribute('aria-label').trim();
    }
    return '';
}

// New function: validateTableAccessibility & validateTableStructure
function validateTableAccessibility(tableElement) {
    if (!tableElement) return false;
    const hasCaption = tableElement.querySelector('caption');
    const hasSummary = tableElement.hasAttribute('summary') || tableElement.querySelector('summary');
    const hasScopeHeaders = tableElement.querySelectorAll('[scope="col"], [scope="row"]').length > 0;
    
    return hasCaption || hasSummary || hasScopeHeaders;
}

function validateTableStructure(tableElement) {
    if (!tableElement) return false;
    const hasTableHead = tableElement.querySelector('thead');
    const hasTableBody = tableElement.querySelector('tbody');
    const rows = tableElement.querySelectorAll('tr');
    
    return hasTableHead && rows.length > 0;
}

// New function: validateLandmark & validateLandmarkStructure
function validateLandmark(element, role) {
    if (!element || !role) return false;
    element.setAttribute('role', role);
    return true;
}

function validateLandmarkStructure(element) {
    if (!element) return false;
    const validRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo'];
    const role = element.getAttribute('role');
    return validRoles.includes(role);
}

// New function: getLangAttribute & getFullLangAttribute
function getLangAttribute() {
    return document.documentElement.lang || 'en';
}

function getFullLangAttribute() {
    const lang = document.documentElement.lang || 'en';
    const region = document.documentElement.langRegion || '';
    return region ? `${lang}-${region}` : lang;
}

// New function: validateUniqueLandmarks
function validateUniqueLandmarks() {
    const landmarks = document.querySelectorAll('header, nav, main, aside, footer');
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

// New function: createInPageButton & createAccessibleLink
function createInPageButton(text, targetId) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = text;
    button.setAttribute('aria-controls', targetId);
    button.addEventListener('click', () => {
        const target = document.getElementById(targetId);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
    return button;
}

function createAccessibleLink(text, href) {
    const link = document.createElement('a');
    link.href = href;
    link.textContent = text;
    link.setAttribute('aria-label', text);
    return link;
}

// New event listener for the toggle rotation functionality
document.querySelector('.toggle-rotation-btn').addEventListener('click', toggleRotation);

// Initialize landmark regions
setupLandmarkRegions();

// Export the new functions if needed, otherwise preserve existing exports
export { 
    rotate, 
    rotateBack, 
    toggleRotation, 
    setupLandmarkRegions, 
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