// main.js - JavaScript file for the project

/**
 * Wraps the given content in a main landmark element
 * @param {string} content - The HTML content to wrap
 * @returns {string} - The content wrapped in a <main> element
 */
function wrapInMainLandmark(content) {
    return `<main>${content}</main>`;
}

/**
 * Generates the complete HTML document with proper landmarks
 * @param {Object} options - Configuration options
 * @param {string} options.title - Page title
 * @param {string} options.mainContent - The main content of the page
 * @param {string} [options.headerContent=''] - Optional header content
 * @param {string} [options.footerContent=''] - Optional footer content
 * @returns {string} - Complete HTML document
 */
function generateHTMLDocument(options) {
    const { title, mainContent, headerContent = '', footerContent = '' } = options;
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
</head>
<body>
    ${headerContent ? `<header>${headerContent}</header>` : ''}
    <main>
        ${mainContent}
    </main>
    ${footerContent ? `<footer>${footerContent}</footer>` : ''}
</body>
</html>`;
}

module.exports = {
    wrapInMainLandmark,
    generateHTMLDocument
};