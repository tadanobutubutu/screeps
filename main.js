const fs = require('fs');
const path = require('path');

/**
 * Fixes SVG accessibility issues by adding aria-hidden="true" to decorative SVGs
 *
 * Issue: REACT_041 - React SVG Accessible Name
 * Affected files: app/layout.tsx, dashboard/app/layout.tsx
 * Fix: Add aria-hidden="true" if the SVG is decorative
 */
const fixSVGAccessibility = (filePath) => {
    try {
        let content = fs.readFileSync(filePath, 'utf8');

        // Pattern to match SVG tags in metadata/icon links (typically decorative)
        // Matches: <link rel="icon" ... href="data:image/svg+xml..." ... />
        const svgMetadataPattern = /<link\s+([^>]*?)rel=["']icon["']([^>]*?)>/gi;
        let hasChanges = false;

        content = content.replace(svgMetadataPattern, (match, attrs1, attrs2) => {
            const allAttrs = attrs1 + attrs2;

            // Check if aria-hidden is already present
            if (allAttrs.includes('aria-hidden') || match.includes('aria-hidden')) {
                return match;
            }

            // For favicon/icon SVGs, they are typically decorative
            // Add aria-hidden="true" to hide from screen readers
            hasChanges = true;
            // Add aria-hidden before the closing />
            if (match.endsWith('/>')) {
                return match.replace(/\/>$/, ' aria-hidden="true" />');
            } else if (match.endsWith('>')) {
                return match.replace(/>$/, ' aria-hidden="true">');
            }
            return match;
        });

        if (hasChanges) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Fixed SVG accessibility in: ${filePath}`);
            return true;
        }

        console.log(`ℹ️ No changes needed in: ${filePath}`);
        return false;
    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
        return false;
    }
};

// Files to fix based on the issue report
const filesToFix = [
    'app/layout.tsx',
    'dashboard/app/layout.tsx'
];

// Execute fixes
console.log('🔧 Fixing React SVG Accessible Name (REACT_041) issues...\n');
filesToFix.forEach(file => {
    const fullPath = path.join(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
        fixSVGAccessibility(fullPath);
    } else {
        console.log(`⚠️ File not found: ${file}`);
    }
});
console.log('\n✨ Done! Review the changes and ensure tests still pass.');

/** *
 * REFERENCE SECTION: Accessibility Templates
 * Below is a template showing how to fix the REACT_027 issue (Table Scope)
 * This is kept for developer reference during the accessibility audit.
 */
/* import React from 'react';
function DataTable({ headers, data }) {
    return (
        <table>
            <thead>
                <tr>
                    {headers.map((header, index) => (
                        <th key={index} scope="col">{header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                            cellIndex === 0 ? (
                                <th key={cellIndex} scope="row">{cell}</th>
                            ) : (
                                <td key={cellIndex}>{cell}</td>
                            )
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
export default DataTable; */