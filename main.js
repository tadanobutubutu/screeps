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

/**
 * Fixes React Landmarks by adding <main> tags to primary content
 *
 * Issue: REACT_017 - React Landmarks
 * Affected files: app/layout.tsx, dashboard/app/layout.tsx, docs/dependency-graph.html, docs/index.html
 * Fix: Wrap primary content in <main> tags
 */
const fixReactLandmarks = (filePath) => {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let hasChanges = false;

        // Check if file is a React component (.tsx) or HTML (.html)
        const isReact = filePath.endsWith('.tsx');
        const isHTML = filePath.endsWith('.html');

        if (isReact) {
            // For React components, look for <body> and wrap children in <main>
            const reactPattern = /(<body[^>]*>)([\s\S]*?)<\/body>/i;
            content = content.replace(reactPattern, (match, openingTag, children) => {
                // Check if <main> already exists
                if (children.includes('<main') || children.includes('</main>')) {
                    return match;
                }

                hasChanges = true;
                // Wrap children in <main> with appropriate className if present
                const classMatch = openingTag.match(/className=["']([^"']*)["']/);
                const className = classMatch ? ` className="${classMatch[1]}"` : '';

                return `${openingTag}\n            <main${className}>${children.trim()}</main>\n        </body>`;
            });
        } else if (isHTML) {
            // For HTML files, look for <body> and wrap content in <main>
            const htmlPattern = /(<body[^>]*>)([\s\S]*?)<\/body>/i;
            content = content.replace(htmlPattern, (match, openingTag, children) => {
                // Check if <main> already exists
                if (children.includes('<main') || children.includes('</main>')) {
                    return match;
                }

                hasChanges = true;
                // Wrap children in <main>
                return `${openingTag}\n    <main>\n        ${children.trim()}\n    </main>\n</body>`;
            });
        }

        if (hasChanges) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Fixed React Landmarks in: ${filePath}`);
            return true;
        }

        console.log(`ℹ️ No changes needed in: ${filePath}`);
        return false;
    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
        return false;
    }
};

/**
 * Fixes multiple main landmarks in Dashboard components
 *
 * Issue: REACT_025 - React Unique Landmarks
 * Affected files: components/Dashboard.tsx, dashboard/components/Dashboard.tsx
 * Fix: Replace duplicate main elements with section or article elements
 */
const fixMultipleMainLandmarks = (filePath) => {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let hasChanges = false;

        // Pattern to match main elements
        const mainPattern = /<main([^>]*)>([\s\S]*?)<\/main>/gi;

        // Count main elements
        const mainMatches = content.match(mainPattern);
        const mainCount = mainMatches ? mainMatches.length : 0;

        if (mainCount > 1) {
            hasChanges = true;
            // Replace all but the first main with section
            content = content.replace(mainPattern, (match, attrs, children, offset) => {
                // Keep the first main, replace others with section
                if (offset === content.search(mainPattern)) {
                    return match; // Keep the first main
                } else {
                    return `<section${attrs}>${children}</section>`;
                }
            });

            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Fixed multiple main landmarks in: ${filePath}`);
        } else {
            console.log(`ℹ️ No multiple main landmarks found in: ${filePath}`);
        }

        return hasChanges;
    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
        return false;
    }
};

/**
 * Fixes table structure issues by adding proper scope attributes
 *
 * Issue: REACT_027 - React Table Structure
 * Affected files: components/DataTable.tsx, dashboard/components/DataTable.tsx
 * Fix: Add scope attributes to table headers
 */
const fixTableStructure = (filePath) => {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let hasChanges = false;

        // Pattern to match table headers without scope
        const headerPattern = /<th([^>]*)>([\s\S]*?)<\/th>/gi;

        content = content.replace(headerPattern, (match, attrs, content) => {
            // Check if scope is already present
            if (attrs.includes('scope=')) {
                return match;
            }

            hasChanges = true;
            // Determine scope based on context (simplified approach)
            // This is a basic implementation - may need refinement for complex tables
            const isRowHeader = content.trim().length > 0; // Simple heuristic
            const scopeValue = isRowHeader ? 'row' : 'col';

            // Add scope attribute
            const newAttrs = attrs.trim() + ` scope="${scopeValue}"`;
            return `<th${newAttrs}>${content}</th>`;
        });

        if (hasChanges) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Fixed table structure in: ${filePath}`);
            return true;
        }

        console.log(`ℹ️ No table structure fixes needed in: ${filePath}`);
        return false;
    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
        return false;
    }
};

/**
 * Fixes fake link issues by replacing <div> with proper <a> tags
 *
 * Issue: REACT_036 - React Fake Link
 * Affected files: components/Link.tsx, dashboard/components/Link.tsx
 * Fix: Replace div-based links with proper anchor tags
 */
const fixFakeLinks = (filePath) => {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let hasChanges = false;

        // Pattern to match div elements that look like links
        const fakeLinkPattern = /<div([^>]*?)(?:onClick|role=["']button["']|className=["'][^"']*link[^"']*["'])[^>]*>([\s\S]*?)<\/div>/gi;

        content = content.replace(fakeLinkPattern, (match, attrs, children) => {
            // Extract href if available
            const hrefMatch = attrs.match(/href=["']([^"']*)["']/);
            const href = hrefMatch ? ` href="${hrefMatch[1]}"` : '';

            // Extract onClick handler if available
            const onClickMatch = attrs.match(/onClick={([^}]*)}/);
            const onClick = onClickMatch ? ` onClick={${onClickMatch[1]}}` : '';

            // Preserve other attributes
            const otherAttrs = attrs.replace(/href=["'][^"']*["']/, '')
                                   .replace(/onClick={[^}]*}/, '')
                                   .replace(/role=["']button["']/, '');

            hasChanges = true;
            return `<a${otherAttrs}${href}${onClick}>${children}</a>`;
        });

        if (hasChanges) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Fixed fake links in: ${filePath}`);
            return true;
        }

        console.log(`ℹ️ No fake link fixes needed in: ${filePath}`);
        return false;
    } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
        return false;
    }
};

// Files to fix based on the issue report
const filesToFix = [
    'app/layout.tsx',
    'dashboard/app/layout.tsx',
    'docs/dependency-graph.html',
    'docs/index.html'
];

// Files specifically for the REACT_025 issue
const dashboardFiles = [
    'components/Dashboard.tsx',
    'dashboard/components/Dashboard.tsx'
];

// Files for REACT_027 - Table Structure
const tableFiles = [
    'components/DataTable.tsx',
    'dashboard/components/DataTable.tsx'
];

// Files for REACT_036 - Fake Links
const linkFiles = [
    'components/Link.tsx',
    'dashboard/components/Link.tsx'
];

// Execute fixes
console.log('🔧 Fixing React SVG Accessible Name (REACT_041) issues...\n');
filesToFix.forEach(file => {
    const fullPath = path.join(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
        if (file.endsWith('.tsx') || file.endsWith('.html')) {
            fixSVGAccessibility(fullPath);
        }
    } else {
        console.log(`⚠️ File not found: ${file}`);
    }
});

console.log('\n🔧 Fixing React Landmarks (REACT_017) issues...\n');
filesToFix.forEach(file => {
    const fullPath = path.join(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
        fixReactLandmarks(fullPath);
    } else {
        console.log(`⚠️ File not found: ${file}`);
    }
});

console.log('\n🔧 Fixing React Unique Landmarks (REACT_025) issues...\n');
dashboardFiles.forEach(file => {
    const fullPath = path.join(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
        fixMultipleMainLandmarks(fullPath);
    } else {
        console.log(`⚠️ File not found: ${file}`);
    }
});

console.log('\n🔧 Fixing React Table Structure (REACT_027) issues...\n');
tableFiles.forEach(file => {
    const fullPath = path.join(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
        fixTableStructure(fullPath);
    } else {
        console.log(`⚠️ File not found: ${file}`);
    }
});

console.log('\n🔧 Fixing React Fake Links (REACT_036) issues...\n');
linkFiles.forEach(file => {
    const fullPath = path.join(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
        fixFakeLinks(fullPath);
    } else {
        console.log(`⚠️ File not found: ${file}`);
    }
});

console.log('\n✨ Done! Review the changes and ensure tests still pass.');

/**
 * Updates dependencies in package.json to the latest versions
 * based on the Renovate dashboard updates
 */
const updateDependencies = () => {
    try {
        const packageJsonPath = path.join(process.cwd(), 'package.json');
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

        // Update dependencies
        const dependencyUpdates = {
            'react': '^19.0.0',
            'jest': '^30.0.0',
            'eslint': '^10.0.0',
            'babel-jest': '^30.0.0'
        };

        let hasChanges = false;

        for (const [dep, version] of Object.entries(dependencyUpdates)) {
            if (packageJson.dependencies && packageJson.dependencies[dep] !== version) {
                packageJson.dependencies[dep] = version;
                hasChanges = true;
                console.log(`🔄 Updated ${dep} to ${version}`);
            }
        }

        if (hasChanges) {
            fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n', 'utf8');
            console.log('✅ Updated package.json dependencies');
        } else {
            console.log('ℹ️ No dependency updates needed in package.json');
        }

        return hasChanges;
    } catch (error) {
        console.error('❌ Error updating dependencies:', error.message);
        return false;
    }
};

/**
 * Updates TypeScript version in package.json
 */
const updateTypeScript = () => {
    try {
        const packageJsonPath = path.join(process.cwd(), 'package.json');
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

        const newVersion = '^7.0.0';

        if (packageJson.dependencies && packageJson.dependencies.typescript !== newVersion) {
            packageJson.dependencies.typescript = newVersion;
            fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n', 'utf8');
            console.log(`🔄 Updated TypeScript to ${newVersion}`);
            return true;
        }

        console.log('ℹ️ TypeScript version is already up to date');
        return false;
    } catch (error) {
        console.error('❌ Error updating TypeScript:', error.message);
        return false;
    }
};

// Execute dependency updates
console.log('\n🔧 Updating dependencies based on Renovate recommendations...\n');
updateDependencies();
updateTypeScript();

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