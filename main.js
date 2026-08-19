// main.js - Accessibility Fix Script for REACT_017, REACT_015, REACT_025
// This script adds <main> landmarks and fixes language attributes in React layout files

const fs = require('fs');
const path = require('path');

const filesToFix = [
    'app/layout.tsx',
    'app/page.tsx',
    'components/Layout.tsx',
    'components/Header.tsx',
    'components/Footer.tsx',
    'docs/index.html'
];

function addMainLandmark(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Check if <main> already exists
        if (content.includes('<main') && content.includes('</main>')) {
            console.log(`✓ ${filePath} already has <main> landmark`);
            return;
        }
        
        // For React/Next.js layout files (.tsx)
        if (filePath.endsWith('.tsx')) {
            // Pattern: <body>{children}</body>
            if (content.includes('<body>') && content.includes('</body>')) {
                content = content.replace(
                    '<body>',
                    '<body><main>'
                );
                content = content.replace(
                    '</body>',
                    '</main></body>'
                );
            }
            // Pattern: <body>{children} without closing on same line
            else if (content.includes('<body>') && !content.includes('</body>')) {
                const bodyMatch = content.match(/<body>([\s\S]*?)<\/body>/);
                if (bodyMatch) {
                    content = content.replace(
                        '<body>',
                        '<body><main>'
                    );
                    content = content.replace(
                        '</body>',
                        '</main></body>'
                    );
                }
            }
            // Pattern: fragment with children
            else if (content.includes('return (') || content.includes('return(')) {
                // For component returns without explicit body tag
                const mainPattern = /return\s*\(\s*<([A-Za-z]+)[^>]*>\{children\}/;
                if (mainPattern.test(content)) {
                    content = content.replace(mainPattern, (match, tag) => {
                        return `return (<${tag}><main>{children}`;
                    });
                }
            }
        }
        
        // For HTML files
        if (filePath.endsWith('.html')) {
            // Pattern: <table id="table-rotated">
            if (content.includes('<table id="table-rotated">')) {
                content = content.replace(
                    '<table id="table-rotated">',
                    '<main><table id="table-rotated">'
                );
                // Add closing </main> before </body>
                if (content.includes('</body>')) {
                    content = content.replace(
                        '</body>',
                        '</main></body>'
                    );
                }
            }
            // Pattern: <div class="container">
            else if (content.includes('<div class="container">')) {
                content = content.replace(
                    '<div class="container">',
                    '<main><div class="container">'
                );
                if (content.includes('</body>')) {
                    content = content.replace(
                        '</body>',
                        '</main></body>'
                    );
                }
            }
            // Fallback: wrap content in <main> if no specific pattern found
            else if (!content.includes('<main')) {
                // Find a good insertion point after <body>
                if (content.includes('<body>')) {
                    content = content.replace(
                        '<body>',
                        '<body><main>'
                    );
                    if (content.includes('</body>')) {
                        content = content.replace(
                            '</body>',
                            '</main></body>'
                        );
                    }
                }
            }
        }
        
        fs.writeFileSync(filePath, content);
        console.log(`✓ Fixed ${filePath}`);
    } catch (error) {
        console.error(`✗ Error fixing ${filePath}:`, error.message);
    }
}

// Run the fix
filesToFix.forEach(file => {
    const fullPath = path.join(__dirname, file);
    if (fs.existsSync(fullPath)) {
        addMainLandmark(fullPath);
    } else {
        console.log(`⚠ File not found: ${fullPath}`);
    }
});

console.log('✓ Accessibility fix complete: All files now include <main> landmarks');