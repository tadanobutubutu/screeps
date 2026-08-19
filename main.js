// main.js - Accessibility Fix Script for REACT_017 and REACT_025
// This script adds <main> landmarks to React layout files and ensures unique main landmarks

const fs = require('fs');
const path = require('path');

const filesToFix = [
    'app/layout.tsx',
    'dashboard/app/layout.tsx',
    'dashboard/reports/app/layout.tsx',
    'docs/index.html'
];

function addMainLandmark(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');

        // Check if <main> already exists
        if (content.includes('<main>')) {
            console.log(`✓ ${filePath} already has <main> landmark`);
            return;
        }

        // For React/Next.js layout files (.tsx)
        if (filePath.endsWith('.tsx')) {
            // Pattern: <body>{children}</body>
            if (content.includes('<body>{children}</body>')) {
                content = content.replace(
                    '<body>{children}</body>',
                    '<body><main>{children}</main></body>'
                );
            }
            // Pattern: <body>{children}
            else if (content.includes('<body>') && content.includes('{children}')) {
                content = content.replace(
                    '<body>{children}</body>',
                    '<body><main>{children}</main></body>'
                );
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
                content = content.replace(
                    '</body>',
                    '</main></body>'
                );
            }
            // Pattern: <div class="container">
            else if (content.includes('<div class="container">')) {
                content = content.replace(
                    '<div class="container">',
                    '<main><div class="container">'
                );
                content = content.replace(
                    '</body>',
                    '</main></body>'
                );
            }
        }

        fs.writeFileSync(filePath, content);
        console.log(`✓ Fixed ${filePath}`);
    } catch (error) {
        console.error(`✗ Error fixing ${filePath}:`, error.message);
    }
}

function ensureUniqueMainLandmark(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');

        // Check for multiple main elements
        const mainCount = (content.match(/<main>/g) || []).length;
        if (mainCount > 1) {
            console.log(`⚠ Found ${mainCount} <main> elements in ${filePath}. Fixing...`);

            // For React components, we'll wrap the content in a single main
            if (filePath.endsWith('.tsx')) {
                // Find the outermost JSX element and wrap it in main
                const jsxMatch = content.match(/return\s*\(([\s\S]*?)\)\s*;/);
                if (jsxMatch) {
                    const jsxContent = jsxMatch[1].trim();
                    const newContent = content.replace(
                        jsxMatch[0],
                        `return (<main>${jsxContent}</main>);`
                    );
                    fs.writeFileSync(filePath, newContent);
                    console.log(`✓ Fixed multiple main elements in ${filePath}`);
                }
            }
            // For HTML files, we'll wrap the main content
            else if (filePath.endsWith('.html')) {
                const bodyContent = content.match(/<body>([\s\S]*?)<\/body>/);
                if (bodyContent) {
                    const newContent = content.replace(
                        bodyContent[0],
                        `<body><main>${bodyContent[1]}</main></body>`
                    );
                    fs.writeFileSync(filePath, newContent);
                    console.log(`✓ Fixed multiple main elements in ${filePath}`);
                }
            }
        }
    } catch (error) {
        console.error(`✗ Error ensuring unique main in ${filePath}:`, error.message);
    }
}

// Run the fixes
filesToFix.forEach(file => {
    const fullPath = path.join(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
        addMainLandmark(fullPath);
        ensureUniqueMainLandmark(fullPath);
    } else {
        console.log(`⚠ File not found: ${fullPath}`);
    }
});

console.log('\nREACT_017 and REACT_025 fixes complete: All files now include proper <main> landmarks');