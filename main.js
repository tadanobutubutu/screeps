/**
 * Creates an in-page button element with the specified label and click handler.
 * 
 * @param {string} label - The text to display on the button.
 * @param {Function} onClick - The callback function to execute on click.
 * @param {Object} options - Additional styling or attribute options.
 * @returns {HTMLButtonElement} The created button element.
 */
function createInPageButton(label, onClick, options = {}) {
    const button = document.createElement('button');
    button.innerText = label;
    button.addEventListener('click', onClick);
    
    if (options.className) {
        button.className = options.className;
    }
    
    if (options.id) {
        button.id = options.id;
    }
    
    if (options.style) {
        Object.assign(button.style, options.style);
    }
    
    return button;
}

// TODO: Implement this function for creating in-page buttons
// (Now implemented)