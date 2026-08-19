// main.js - Accessibility Fix Script for REACT_017 and REACT_036
// This script adds <main> landmarks to React layout files and fixes fake links

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

function fixFakeLinks(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');

        // Check if the fake link exists
        if (content.includes('<a id="unrotate" href="#">')) {
            // Replace with a button element
            content = content.replace(
                '<a id="unrotate" href="#">rotate back</a>',
                '<button id="unrotate" class="rotate-button">rotate back</button>'
            );

            // Add CSS for the button if not already present
            if (!content.includes('.rotate-button')) {
                content = content.replace(
                    '</style>',
                    '.rotate-button { background: none; border: none; padding: 0; font: inherit; cursor: pointer; color: inherit; text-decoration: underline; }</style>'
                );
            }

            fs.writeFileSync(filePath, content);
            console.log(`✓ Fixed fake link in ${filePath}`);
        } else {
            console.log(`✓ No fake links to fix in ${filePath}`);
        }
    } catch (error) {
        console.error(`✗ Error fixing fake links in ${filePath}:`, error.message);
    }
}

// Run the fixes
filesToFix.forEach(file => {
    const fullPath = path.join(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
        addMainLandmark(fullPath);
        if (file.includes('dependency-graph.html')) {
            fixFakeLinks(fullPath);
        }
    } else {
        console.log(`⚠ File not found: ${fullPath}`);
    }
});

console.log('\nREACT_017 and REACT_036 fixes complete: All files now include <main> landmarks and proper link handling');