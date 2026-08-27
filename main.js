// main.js

// Import required modules
const { renderCreep } = require('./renderCreep');
const { renderStructure } = require('./renderStructure');
const { renderController } = require('./renderController');

// TODO: Add these imported modules to the relevant rendering functions

/**
 * Main rendering function that orchestrates all rendering operations
 */
function renderAll() {
    renderCreep();
    renderStructure();
    renderController();
}

/**
 * Creates an in-page button element with accessible styling
 * @param {string} label - The button label text
 * @param {Function} onClick - The click handler function
 * @param {string} [id] - Optional id for the button
 * @returns {HTMLElement} The created button element
 */
function createInPageButton(label, onClick, id) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.className = 'in-page-button';
    
    if (id) {
        button.id = id;
    }
    
    if (typeof onClick === 'function') {
        button.addEventListener('click', onClick);
    }
    
    return button;
}

/**
 * Creates an accessible link element with proper ARIA attributes
 * @param {string} href - The URL the link points to
 * @param {string} text - The link text content
 * @param {Object} [options] - Optional configuration object
 * @param {string} [options.id] - Optional id for the link
 * @param {boolean} [options.external] - Whether the link is external (adds rel="noopener noreferrer")
 * @param {string} [options.ariaLabel] - Optional ARIA label for the link
 * @returns {HTMLElement} The created anchor element
 */
function createAccessibleLink(href, text, options = {}) {
    const link = document.createElement('a');
    link.href = href;
    link.textContent = text;
    
    if (options.id) {
        link.id = options.id;
    }
    
    if (options.external) {
        link.rel = 'noopener noreferrer';
        link.target = '_blank';
    }
    
    if (options.ariaLabel) {
        link.setAttribute('aria-label', options.ariaLabel);
    }
    
    return link;
}

module.exports = {
    renderAll,
    renderCreep,
    renderStructure,
    renderController,
    createInPageButton,
    createAccessibleLink
};