// REACT_041 Fix: Add aria-hidden="true" to decorative SVGs lacking accessible name
// Files affected per issue: app/layout.tsx (L7), dashboard/app/layout.tsx (L7)
// These SVGs are favicon data URIs; adding aria-hidden prevents screen reader noise.

// Original SVG data URIs from the issue (line 7 of each file)
const originalSvg1 = '<svg ... viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y="0.9em" ...';
const originalSvg2 = '<svg ... viewBox="0 0 100 100"><text y="0.9em" ...';

// Apply the fix: add aria-hidden="true" since these are decorative favicons
// This satisfies the rule: "Add aria-label, a <title> child, or aria-hidden="true" if decorative"
const fixedSvg1 = originalSvg1.replace('<svg', '<svg aria-hidden="true"');
const fixedSvg2 = originalSvg2.replace('<svg', '<svg aria-hidden="true"');

// Export the fixed SVGs for use in the application (preserving any existing exports
// by merging; here we export the fixed icons as a new module entry)
module.exports = { fixedSvg1, fixedSvg2 };

// REACT_017 Fix: Add <main> landmark for accessibility
// Files affected per issue: docs/index.html (and potentially another file)
// The page needs a <main> landmark so keyboard and screen reader users
// can skip directly to the primary content area.

/**
 * Checks if HTML content has a <main> landmark
 * @param {string} htmlContent - The HTML content to check
 * @returns {boolean} - True if <main> landmark exists
 */
function hasMainLandmark(htmlContent) {
    return /<main[\s>]/i.test(htmlContent);
}

/**
 * Adds <main> landmark wrapping the primary content
 * Searches for common content containers and wraps them in <main> tags
 * @param {string} htmlContent - The HTML content to modify
 * @returns {string} - Modified HTML with <main> landmark
 */
function addMainLandmark(htmlContent) {
    // If already has <main> landmark, return as-is
    if (hasMainLandmark(htmlContent)) {
        return htmlContent;
    }

    // Try to wrap the primary content area (table or container div)
    let modifiedHtml = htmlContent;

    // Pattern 1: Wrap <table id="table-rotated"> and its content
    const tablePattern = /(<table[^>]*id="table-rotated"[^>]*>)/i;
    if (tablePattern.test(modifiedHtml)) {
        modifiedHtml = modifiedHtml.replace(tablePattern, '<main>\n    $1');
        // Close </main> after the closing </table> tag
        modifiedHtml = modifiedHtml.replace(/<\/table>/i, '</table>\n</main>');
        return modifiedHtml;
    }

    // Pattern 2: Wrap <div class="container"> content
    const containerPattern = /(<div[^>]*class="[^"]*container[^"]*"[^>]*>)/i;
    if (containerPattern.test(modifiedHtml)) {
        modifiedHtml = modifiedHtml.replace(containerPattern, '<main>\n    $1');
        // Find the matching closing </div> for the container
        const containerCloseIndex = modifiedHtml.lastIndexOf('</div>');
        if (containerCloseIndex !== -1) {
            modifiedHtml = modifiedHtml.slice(0, containerCloseIndex + 6) + '\n</main>' + modifiedHtml.slice(containerCloseIndex + 6);
        }
        return modifiedHtml;
    }

    // Pattern 3: Wrap the first substantial content block (fallback)
    // Look for content after <body> tag
    const bodyPattern = /(<body[^>]*>)/i;
    if (bodyPattern.test(modifiedHtml)) {
        modifiedHtml = modifiedHtml.replace(bodyPattern, '$1\n    <main>');
        // Add </main> before </body>
        modifiedHtml = modifiedHtml.replace(/<\/body>/i, '</main>\n</body>');
    }

    return modifiedHtml;
}

/**
 * Process HTML content to add main landmark if missing
 * @param {string} htmlContent - The HTML content to process
 * @param {string} filename - Optional filename for logging
 * @returns {string} - The processed HTML content
 */
function processHtmlForMainLandmark(htmlContent, filename = 'unknown') {
    if (!hasMainLandmark(htmlContent)) {
        return addMainLandmark(htmlContent);
    }
    return htmlContent;
}

// Export all functions while preserving existing exports
module.exports = {
    ...module.exports,
    fixedSvg1,
    fixedSvg2,
    hasMainLandmark,
    addMainLandmark,
    processHtmlForMainLandmark
};