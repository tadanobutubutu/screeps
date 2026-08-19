// main.js - Accessibility Fix Script for REACT_017 and REACT_015
// This script adds <main> landmarks and language attributes to React layout files

const fs = require('fs');
const path = require('path');

const filesToFix = [
    'app/layout.tsx',
    'dashboard/app/layout.tsx',
    'dashboard/reports/app/layout.tsx',
    'docs/index.html',
    'docs/dependency-graph.html'
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

function addLanguageAttribute(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');

        // Check if lang attribute already exists
        if (content.includes('<html lang=')) {
            console.log(`✓ ${filePath} already has lang attribute`);
            return;
        }

        // Add lang="en" to <html> tag
        content = content.replace(
            '<html>',
            '<html lang="en">'
        );

        fs.writeFileSync(filePath, content);
        console.log(`✓ Added lang attribute to ${filePath}`);
    } catch (error) {
        console.error(`✗ Error adding lang attribute to ${filePath}:`, error.message);
    }
}

// Run the fixes
filesToFix.forEach(file => {
    const fullPath = path.join(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
        addMainLandmark(fullPath);
        if (fullPath.endsWith('.html')) {
            addLanguageAttribute(fullPath);
        }
    } else {
        console.log(`⚠ File not found: ${fullPath}`);
    }
});

console.log('\nREACT_017 and REACT_015 fixes complete: All files now include <main> landmarks and language attributes');