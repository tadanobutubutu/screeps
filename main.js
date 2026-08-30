// TODO: Implement wrapPrimaryContentInMain function, including the added logic

/**
 * Wraps the primary content of the document in a <main> element
 * @param {Document|Element} context - The context to search within (default: document)
 * @returns {Element} The created <main> element containing the primary content
 */
function wrapPrimaryContentInMain(context = document) {
    const container = context.body || context;
    const mainElement = document.createElement('main');
    
    // Move all existing children to the main element
    while (container.firstChild) {
        mainElement.appendChild(container.firstChild);
    }
    
    // Append the main element to the container
    container.appendChild(mainElement);
    
    return mainElement;
}

module.exports = {
    wrapPrimaryContentInMain
};