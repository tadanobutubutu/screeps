/**
 * Main application entry point
 * Handles React Landmark accessibility fixes (REACT_017)
 */

/**
 * Adds a <main> landmark wrapper around the primary content
 * @param {string} htmlContent - The HTML content to process
 * @returns {string} - HTML content with <main> landmark added
 */
function addMainLandmark(htmlContent) {
    // Match content between body tags or content after header/nav
    const mainLandmarkRegex = /<main[\s\S]*?<\/main>/gi;
    
    // Check if main landmark already exists
    if (mainLandmarkRegex.test(htmlContent)) {
        return htmlContent;
    }
    
    // Pattern to identify where main content starts
    const contentStartPattern = /(<table id="table-rotated">|<div class="container">|<div id="[^"]*content[^"]*">|<section[^>]*>)/i;
    
    if (contentStartPattern.test(htmlContent)) {
        // Wrap the primary content in <main> landmark
        return htmlContent.replace(
            contentStartPattern,
            '<main>\n    $1'
        ).replace(
            /(\<(table|div|section)[^>]*>[\s\S]*?\<\/\1>)(\s*\<\/body>)/gi,
            '$1\n</main>$3'
        );
    }
    
    return htmlContent;
}

module.exports = {
    addMainLandmark
};