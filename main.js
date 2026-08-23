// main.js

/**
 * Adds <main> landmark to HTML content for accessibility (REACT_017)
 * @param {string} htmlContent - The HTML content to process
 * @returns {string} - HTML content with <main> landmark added
 */
function addMainLandmark(htmlContent) {
    // Check if <main> already exists
    if (htmlContent.includes('<main>')) {
        return htmlContent;
    }

    // Wrap primary content in <main> landmark
    // Pattern 1: Container div with Quality & Metrics content
    let updated = htmlContent.replace(
        /(<div class="container">[\s\S]*?<\/div>\s*)<\/body>/i,
        '<main>$1</main></body>'
    );

    // Pattern 2: Table rotated content
    if (updated === htmlContent) {
        updated = htmlContent.replace(
            /(<table id="table-rotated">[\s\S]*?<\/table>\s*)<\/body>/i,
            '<main>$1</main></body>'
        );
    }

    return updated;
}

// Export for use by other modules
module.exports = {
    addMainLandmark
};