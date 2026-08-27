// main.js - Main application entry point
// This file handles the HTML generation for docs pages

const fs = require('fs');
const path = require('path');

// Function to generate HTML with proper landmarks
function generateHTMLPage(content, title) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
</head>
<body>
    <header>
        <nav>
            <!-- Navigation content -->
        </nav>
    </header>
    <main>
        ${content}
    </main>
    <footer>
        <!-- Footer content -->
    </footer>
</body>
</html>`;
}

// Function to wrap content in main landmark
function wrapWithMainLandmark(htmlContent) {
    // Check if main landmark already exists
    if (htmlContent.includes('<main>') && htmlContent.includes('</main>')) {
        return htmlContent;
    }
    
    // Add main landmark around primary content
    const mainTag = '<main>';
    const mainCloseTag = '</main>';
    
    // Find the body tag and insert main after it
    let result = htmlContent.replace(/<body[^>]*>/, (match) => {
        return match + '\n' + mainTag;
    });
    
    // Find the closing body tag and insert main closing before it
    result = result.replace(/<\/body>/, mainCloseTag + '\n$&');
    
    return result;
}

// Export functions for testing
module.exports = {
    generateHTMLPage,
    wrapWithMainLandmark
};

// If run directly, generate the docs index page
if (require.main === module) {
    const docsDir = path.join(__dirname, 'docs');
    
    if (!fs.existsSync(docsDir)) {
        fs.mkdirSync(docsDir, { recursive: true });
    }
    
    const indexPath = path.join(docsDir, 'index.html');
    const indexContent = generateHTMLPage(`
        <div class="container">
            <h2>Quality & Metrics Reports</h2>
            <p>
                This repository is fully optimized with automated tools. Explore the generated
                reports below:
            </p>
            <div class="links">
                <a href="plato.html">Plato Code Complexity Report</a>
                <a href="dependency-graph.html">Dependency Graph</a>
            </div>
        </div>
    `, 'Quality & Metrics Reports');
    
    fs.writeFileSync(indexPath, indexContent);
    console.log('Generated docs/index.html with proper landmarks');
}