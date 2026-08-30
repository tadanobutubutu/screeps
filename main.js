// TODO: Implement wrapPrimaryContentInMain function, including the added logic

/**
 * Wraps the primary content in a <main> element for semantic HTML
 * @param {string} content - The HTML content to wrap
 * @returns {string} The content wrapped in a <main> tag
 */
function wrapPrimaryContentInMain(content) {
    return `<main>${content}</main>`;
}

/**
 * Processes and wraps the primary content
 * @param {string} htmlContent - The HTML content to be wrapped
 * @returns {string} The processed HTML content
 */
function processPrimaryContent(htmlContent) {
    return wrapPrimaryContentInMain(htmlContent);
}

module.exports = {
    wrapPrimaryContentInMain,
    processPrimaryContent
};