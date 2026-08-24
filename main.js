/**
 * Main entry point for the application
 * Builds and generates the documentation site
 */

const fs = require('fs');
const path = require('path');

/**
 * Read a file and return its contents
 * @param {string} filePath - Path to the file to read
 * @returns {string} File contents
 */
function readFile(filePath) {
    if (fs.existsSync(filePath)) {
        return fs.readFileSync(filePath, 'utf8');
    }
    return '';
}

/**
 * Write content to a file
 * @param {string} filePath - Path to the file to write
 * @param {string} content - Content to write
 */
function writeFile(filePath, content) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, content, 'utf8');
}

/**
 * Wrap content in a main landmark for accessibility
 * @param {string} content - Content to wrap
 * @returns {string} Content wrapped in <main> tag
 */
function wrapInMainLandmark(content) {
    // Remove existing <main> tags if present (to prevent nesting)
    const withoutExistingMain = content.replace(/<\/?main[^>]*>/gi, '');
    return `<main>\n${withoutExistingMain}\n</main>`;
}

/**
 * Process an HTML file and add main landmark if missing
 * @param {string} filePath - Path to the HTML file
 * @returns {boolean} True if file was modified, false otherwise
 */
function processHtmlFile(filePath) {
    let content = readFile(filePath);
    
    if (!content || !content.includes('<!DOCTYPE') && !content.includes('<html')) {
        return false;
    }
    
    // Check if already has a main landmark
    if (content.includes('<main') || content.includes('</main>')) {
        return false;
    }
    
    // Find the body content and wrap appropriate sections in main
    // This regex finds content between <body> and </body>
    const bodyMatch = content.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    
    if (bodyMatch) {
        const bodyContent = bodyMatch[1];
        const wrappedContent = wrapInMainLandmark(bodyContent);
        content = content.replace(/<body[^>]*>[\s\S]*<\/body>/i, `<body>\n${wrappedContent}\n</body>`);
        writeFile(filePath, content);
        return true;
    }
    
    return false;
}

/**
 * Main function to run the build process
 */
function main() {
    const docsDir = path.join(__dirname, 'docs');
    const indexPath = path.join(docsDir, 'index.html');
    
    console.log('Processing HTML files for accessibility improvements...');
    
    // Process the main index.html file
    if (processHtmlFile(indexPath)) {
        console.log('✓ Added <main> landmark to docs/index.html');
    } else {
        console.log('- docs/index.html already has <main> landmark or is not a valid HTML file');
    }
    
    // Process any other HTML files in docs directory
    if (fs.existsSync(docsDir)) {
        const files = fs.readdirSync(docsDir);
        files.forEach(file => {
            if (file.endsWith('.html') && file !== 'index.html') {
                const filePath = path.join(docsDir, file);
                if (processHtmlFile(filePath)) {
                    console.log(`✓ Added <main> landmark to docs/${file}`);
                }
            }
        });
    }
    
    console.log('Accessibility improvements complete.');
}

// Run the main function
main();

module.exports = {
    readFile,
    writeFile,
    wrapInMainLandmark,
    processHtmlFile,
    main
}