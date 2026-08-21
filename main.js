// main.js - HTML Landmark Processing Utilities

/**
 * Adds a <main> landmark to an HTML string if one doesn't already exist.
 * The <main> tag wraps the primary content within the <body> element.
 * 
 * @param {string} html - The HTML content to process
 * @returns {string} HTML with <main> landmark added
 */
function addMainLandmark(html) {
    // Check if <main> already exists in the document
    const hasMainTag = /<main[\s\S]*?>[\s\S]*?<\/main>/i.test(html);
    if (hasMainTag) {
        return html;
    }

    // Check if body tag exists
    if (!/<body[\s>]/.test(html)) {
        return html;
    }

    // Find the closing </body> tag position
    const bodyCloseMatch = html.match(/<\/body>/i);
    if (!bodyCloseMatch) {
        return html;
    }

    const bodyCloseIndex = bodyCloseMatch.index;

    // Find opening <body> tag
    const bodyOpenMatch = html.match(/<body[\s>]/i);
    if (!bodyOpenMatch) {
        return html;
    }

    const bodyOpenEnd = bodyOpenMatch.index + bodyOpenMatch[0].length;

    // Find first significant content after <body> tag (skipping whitespace/newlines)
    const afterBody = html.substring(bodyOpenEnd, bodyCloseIndex);
    const significantMatch = afterBody.match(/[^<]*[^>\s][^]*/);
    
    if (!significantMatch) {
        return html;
    }

    // Build the new HTML with <main> wrapper
    const beforeBody = html.substring(0, bodyOpenEnd);
    const afterSignificant = html.substring(bodyOpenEnd + significantMatch.index + significantMatch[0].length, bodyCloseIndex);
    const afterBodyClose = html.substring(bodyCloseIndex);

    return beforeBody + '\n<main>' + significantMatch[0] + '</main>' + afterSignificant + afterBodyClose;
}

/**
 * Processes an HTML file and adds main landmark if needed
 * @param {string} filePath - Path to the HTML file
 * @param {string} content - HTML content
 * @returns {string} Processed HTML content
 */
function processHtmlFile(filePath, content) {
    console.log(`Processing: ${filePath}`);
    return addMainLandmark(content);
}

/**
 * Validates that an HTML document has proper landmarks
 * @param {string} html - HTML content to validate
 * @returns {Object} Validation result with details
 */
function validateLandmarks(html) {
    const result = {
        hasMain: /<main[\s\S]*?>[\s\S]*?<\/main>/i.test(html),
        hasNav: /<nav[\s\S]*?>[\s\S]*?<\/nav>/i.test(html),
        hasHeader: /<header[\s\S]*?>[\s\S]*?<\/header>/i.test(html),
        hasFooter: /<footer[\s\S]*?>[\s\S]*?<\/footer>/i.test(html),
        hasBody: /<body[\s>]/.test(html)
    };
    result.isValid = result.hasMain && result.hasBody;
    return result;
}

/**
 * Default export for the landmark utilities module
 */
module.exports = {
    addMainLandmark,
    processHtmlFile,
    validateLandmarks
};

// Named exports for flexibility
module.exports.addMainLandmark = addMainLandmark;
module.exports.processHtmlFile = processHtmlFile;
module.exports.validateLandmarks = validateLandmarks;

// If running directly, process docs/index.html
if (require.main === module) {
    const fs = require('fs');
    const path = require('path');
    
    const docsIndexPath = path.join(__dirname, 'docs', 'index.html');
    
    if (fs.existsSync(docsIndexPath)) {
        let html = fs.readFileSync(docsIndexPath, 'utf8');
        const originalHtml = html;
        
        html = addMainLandmark(html);
        
        if (html !== originalHtml) {
            fs.writeFileSync(docsIndexPath, html, 'utf8');
            console.log(`✓ Added <main> landmark to docs/index.html`);
        } else {
            console.log(`- docs/index.html already has <main> landmark or no <body> tag found`);
        }
    } else {
        console.log(`docs/index.html not found at ${docsIndexPath}`);
    }
}