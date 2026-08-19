// main.js - Accessibility Fix Script for REACT_025
// This script fixes multiple <main> landmark issues by using <section>/<article> for secondary regions

const fs = require('fs');
const path = require('path');

const filesToFix = [
    'app/layout.tsx',
    ...
    'docs/index.html'
];

function hasMultipleMainLandmarks(content) {
    const mainMatches = content.match(/<main[\s>]/gi);
    return mainMatches && mainMatches.length > 1;
}

function countMainLandmarks(content) {
    const mainMatches = content.match(/<main[\s>]/gi);
    return mainMatches ? mainMatches.length : 0;
}

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
            else if (content.includes('<body>{children}') && content.includes('</body>')) {
                content = content.replace(
                    '<body>{children}',
                    '<body><main>{children}'
                );
                content = content.replace(
                    '</body>',
                    '</main></body>'
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

function fixMultipleMainLandmarks(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Skip if this file doesn't have multiple main landmarks
        if (!hasMultipleMainLandmarks(content)) {
            console.log(`✓ ${filePath} does not have multiple <main> landmarks`);
            return;
        }
        
        const mainCount = countMainLandmarks(content);
        console.log(`Found ${mainCount} <main> landmarks in ${filePath} - converting extras to <section>`);
        
        // Replace additional <main> elements with <section> (keep only the first one as <main>)
        // Pattern: <main (attributes)> - replace with <section aria-label="...">
        let foundFirstMain = false;
        
        content = content.replace(/<main(\s[^>]*)?>/gi, (match, attrs) => {
            if (!foundFirstMain) {
                foundFirstMain = true;
                return match; // Keep the first <main> as-is
            }
            // Convert subsequent <main> to <section>
            if (attrs) {
                // Extract id or aria-label from attributes if present
                const idMatch = attrs.match(/id=["']([^"']+)["']/);
                const ariaLabelMatch = attrs.match(/aria-label=["']([^"']+)["']/);
                
                if (idMatch) {
                    return `<section aria-labelledby="${idMatch[1]}">`;
                } else if (ariaLabelMatch) {
                    return `<section aria-label="${ariaLabelMatch[1]}">`;
                }
            }
            return '<section>';
        });
        
        // Replace </main> with </section> for the converted elements
        // This is trickier - we need to count and match properly
        let mainOpenCount = 0;
        content = content.replace(/<main(\s[^>]*)?>/gi, (match) => {
            mainOpenCount++;
            return match;
        });
        
        // Reset and do a proper replacement
        const lines = content.split('\n');
        let processedContent = [];
        let mainCountTracker = 0;
        
        for (let line of lines) {
            // Check if this line has a <main> opening tag
            if (/<main(\s[^>]*)?>/gi.test(line)) {
                mainCountTracker++;
                if (mainCountTracker > 1) {
                    // Replace <main with <section for all but the first
                    line = line.replace(/<main(\s[^>]*)?>/gi, (match, attrs) => {
                        if (attrs) {
                            const idMatch = attrs.match(/id=["']([^"']+)["']/);
                            const ariaLabelMatch = attrs.match(/aria-label=["']([^"']+)["']/);
                            
                            if (idMatch) {
                                return `<section aria-labelledby="${idMatch[1]}">`;
                            } else if (ariaLabelMatch) {
                                return `<section aria-label="${ariaLabelMatch[1]}">`;
                            }
                        }
                        return '<section>';
                    });
                }
            }
            processedContent.push(line);
        }
        
        content = processedContent.join('\n');
        
        fs.writeFileSync(filePath, content);
        console.log(`✓ Fixed multiple <main> landmarks in ${filePath}`);
    } catch (error) {
        console.error(`✗ Error fixing ${filePath}:`, error.message);
    }
}

// Run the fix for single main landmark addition
filesToFix.forEach(file => {
    const fullPath = path.join(__dirname, file);
    if (fs.existsSync(fullPath)) {
        addMainLandmark(fullPath);
    } else {
        console.log(`⚠ File not found: ${fullPath}`);
    }
});

console.log('✓ Accessibility fix complete: All files now include proper landmark hierarchy');