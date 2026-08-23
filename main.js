/**
 * ESLint rule fixer for REACT_041 - React SVG Accessible Name
 * 
 * This script fixes SVGs that lack accessible names by adding aria-hidden="true"
 * for decorative SVGs (those without meaningful content for screen readers).
 */

const fs = require('fs');
const path = require('path');
const { DOMParser } = require('xmldom');

// Files affected by REACT_041
const AFFECTED_FILES = [
    'app/layout.tsx',
    'dashboard/app/layout.tsx'
];

/**
 * Determines if an SVG is decorative (should use aria-hidden="true")
 * An SVG is considered decorative if:
 * - It only contains visual/shape elements (path, circle, rect, etc.)
 * - Any text content is purely cosmetic/brand-related
 * - It serves as a visual identifier rather than conveying information
 */
function isDecorativeSvg(svgContent) {
    // Remove comments
    let cleanContent = svgContent.replace(/\{[\s\S]*?\}/g, '').replace(/<!--[\s\S]*?-->/g, '');
    
    // Check for elements that provide meaningful content
    const hasTitle = /<title[\s\S]*?<\/title>/i.test(cleanContent);
    const hasDescribedBy = /aria-describedby/i.test(cleanContent);
    const hasAriaLabel = /aria-label\s*=/i.test(cleanContent);
    
    // If already has accessible name, it's not decorative in the problematic sense
    if (hasTitle || hasDescribedBy || hasAriaLabel) {
        return false;
    }
    
    // Check if SVG only has visual elements (decorative indicators)
    const decorativeIndicators = [
        /<path[\s\S]*?\/>/i,
        /<circle[\s\S]*?\/>/i,
        /<rect[\s\S]*?\/>/i,
        /<polygon[\s\S]*?\/>/i,
        /<line[\s\S]*?\/>/i,
        /<ellipse[\s\S]*?\/>/i,
        /<g[\s\S]*?<\/g>/i,
        /<use[\s\S]*?\/>/i
    ];
    
    const onlyHasDecorativeElements = decorativeIndicators.every(pattern => 
        !pattern.test(cleanContent) || /<text[\s\S]*?<\/text>/i.test(cleanContent)
    );
    
    // If it only contains visual shapes (favicon-like), it's decorative
    return onlyHasDecorativeElements && !/<text[\s\S]*?<\/text>/i.test(cleanContent);
}

/**
 * Checks if an icon definition needs an accessible name
 */
function needsAccessibleName(iconMatch) {
    const svgContent = iconMatch[0];
    
    // Check if already has accessible name
    if (/aria-hidden\s*=\s*["']true["']/i.test(svgContent)) {
        return false; // Already has aria-hidden
    }
    if (/aria-label\s*=/i.test(svgContent)) {
        return false; // Already has aria-label
    }
    if (/<title[\s\S]*?<\/title>/i.test(svgContent)) {
        return false; // Already has title
    }
    
    return true;
}

/**
 * Fixes SVG icon definitions by adding aria-hidden="true"
 */
function fixSvgAccessibleName(iconMatch) {
    const svgContent = iconMatch[0];
    
    if (!needsAccessibleName(iconMatch)) {
        return svgContent;
    }
    
    // Add aria-hidden="true" for decorative SVGs
    // This is the recommended fix for favicons and decorative icons
    if (isDecorativeSvg(svgContent)) {
        // Add aria-hidden to the opening svg tag
        return svgContent.replace(
            /<svg([^>]*?)>/i,
            '<svg$1 aria-hidden="true">'
        );
    }
    
    // For SVGs that might have content, add a title as fallback
    return svgContent.replace(
        /<svg([^>]*?)>/i,
        '<svg$1 role="img"><title>Icon</title>'
    ).replace(
        /<\/svg>/i,
        '</title></svg>'
    );
}

/**
 * Process a file and fix SVG accessibility issues
 */
function processFile(filePath) {
    if (!fs.existsSync(filePath)) {
        console.warn(`File not found: ${filePath}`);
        return false;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Match icon definitions in Next.js layout files
    // Handles various formats: icon, shortcut, apple, etc.
    const iconPattern = /(icon|shortcut|apple|manifest|image)[\s]*:[\s]*({[\s\S]*?<svg[\s\S]*?<\/svg>[\s\S]*?})/gi;
    
    content = content.replace(iconPattern, (match) => {
        // If the icon value contains an SVG without accessible name, fix it
        if (/<svg[\s\S]*?<\/svg>/i.test(match)) {
            return match.replace(
                /<svg([^>]*?)>([\s\S]*?)<\/svg>/gi,
                (svgMatch, attrs, innerContent) => {
                    // Skip if already has accessible name
                    if (/aria-hidden\s*=\s*["']true["']/i.test(svgMatch) ||
                        /aria-label\s*=/i.test(svgMatch) ||
                        /<title[\s\S]*?<\/title>/i.test(svgMatch)) {
                        return svgMatch;
                    }
                    
                    // Add aria-hidden="true" for decorative icons (favicons)
                    return `<svg${attrs} aria-hidden="true">${innerContent}</svg>`;
                }
            );
        }
        return match;
    });
    
    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed SVG accessible name in: ${filePath}`);
        return true;
    }
    
    return false;
}

/**
 * Main function to run the fixer
 */
function main() {
    console.log('Running REACT_041 fix: React SVG Accessible Name\n');
    
    let fixedCount = 0;
    
    for (const file of AFFECTED_FILES) {
        const filePath = path.resolve(process.cwd(), file);
        if (processFile(filePath)) {
            fixedCount++;
        }
    }
    
    console.log(`\nFixed ${fixedCount} file(s) for REACT_041`);
    
    return fixedCount;
}

// Export for testing
module.exports = {
    isDecorativeSvg,
    needsAccessibleName,
    fixSvgAccessibleName,
    processFile,
    AFFECTED_FILES
};

// Run if executed directly
if (require.main === module) {
    main();
}