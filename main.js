#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Fix REACT_017: Add <main> landmark to docs/index.html
 * Wraps the primary content in a <main> element for accessibility
 */
function fixReactLandmarks() {
    const filePath = path.join(__dirname, 'docs', 'index.html');
    
    if (!fs.existsSync(filePath)) {
        console.log('docs/index.html not found, skipping...');
        return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if <main> already exists, if not wrap the primary content
    if (!content.includes('<main>') && !content.includes('<main ')) {
        // Wrap content after header/navigation with <main> tag
        // Find the body content and wrap it
        const bodyMatch = content.match(/<body[^>]*>([\s\S]*)<\/body>/i);
        
        if (bodyMatch) {
            const bodyContent = bodyMatch[1];
            const wrappedBodyContent = bodyContent.trim().split('\n').map(line => '    ' + line).join('\n');
            
            content = content.replace(
                /<body[^>]*>[\s\S]*<\/body>/i,
                `<body>\n${wrappedBodyContent}\n</body>`
            );
        }
    }
    
    // Ensure proper <main> wrapping - find common patterns and wrap with <main>
    // Pattern 1: <table id="table-rotated">
    if (content.includes('<table id="table-rotated">') && !content.includes('<main>')) {
        content = content.replace(
            /(<table id="table-rotated">)/,
            '<main>\n    $1'
        );
        // Close </main> after the table
        content = content.replace(
            /(<\/table>)/,
            '$1\n</main>'
        );
    }
    
    // Pattern 2: <div class="container"> with Quality & Metrics Reports
    if (content.includes('Quality & Metrics Reports') && !content.match(/<main>[\s\S]*<div class="container">/)) {
        content = content.replace(
            /(<div class="container">)/,
            '<main>\n    $1'
        );
    }
    
    // Ensure all <main> tags are properly closed
    const mainOpenCount = (content.match(/<main[\s\S]*?>/g) || []).length;
    const mainCloseCount = (content.match(/<\/main>/g) || []).length;
    
    // If we have more opening tags, add closing tags
    if (mainOpenCount > mainCloseCount) {
        // Add closing </main> tags at appropriate locations
        const diff = mainOpenCount - mainCloseCount;
        for (let i = 0; i < diff; i++) {
            content += '\n</main>';
        }
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed REACT_017: Added <main> landmarks to docs/index.html');
}

// Run if executed directly
if (require.main === module) {
    fixReactLandmarks();
}

module.exports = { fixReactLandmarks };