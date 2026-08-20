import React, { ReactNode } from 'react';
import fs from 'fs';
import path from 'path';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main role="main">
          {children}
        </main>
      </body>
    </html>
  );
}

/**
 * Checks if a file contains a <main> landmark
 * @param {string} filePath - Path to the file to check
 * @returns {boolean} - True if <main> landmark exists
 */
function hasMainLandmark(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        return /<main[\s>]/i.test(content);
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error.message);
        return false;
    }
}

/**
 * Adds a <main> landmark around children in layout files
 * @param {string} filePath - Path to the layout file
 * @param {string} type - Type of layout ('tsx' or 'html')
 */
function addMainLandmark(filePath, type = 'tsx') {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        if (type === 'tsx') {
            // Pattern: <body>{children}</body> or similar
            content = content.replace(
                /(<body[^>]*>)(\{children\})(<\/body>)/i,
                '<body><main>{children}</main></body>'
            );
            
            // Pattern: <div>{children}</div> in layout
            content = content.replace(
                /(<div[^>]*>)(\{children\})(<\/div>)/i,
                '<main><div>{children}</div></main>'
            );
        } else if (type === 'html') {
            // Pattern: <table id="table-rotated">
            content = content.replace(
                /(<table[^>]*id="table-rotated"[^>]*>)/i,
                '<main>$1'
            );
            
            // Close main before closing body
            content = content.replace(
                /(<\/body>)/i,
                '</main>$1'
            );
        }
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Added <main> landmark to ${filePath}`);
    } catch (error) {
        console.error(`Error modifying file ${filePath}:`, error.message);
    }
}

/**
 * Fixes all files mentioned in the REACT_017 issue
 */
function fixReactLandmarks() {
    const filesToFix = [
        { path: 'app/layout.tsx', type: 'tsx' },
        { path: 'dashboard/app/layout.tsx', type: 'tsx' },
        { path: 'docs/index.html', type: 'html' }
    ];
    
    filesToFix.forEach(({ path: filePath, type }) => {
        const fullPath = path.resolve(process.cwd(), filePath);
        if (!hasMainLandmark(fullPath)) {
            addMainLandmark(fullPath, type);
        } else {
            console.log(`${filePath} already has <main> landmark`);
        }
    });
}

/**
 * Checks all layout files for <main> landmark
 * @param {string[]} filePaths - Array of file paths to check
 * @returns {Object} - Summary of results
 */
function checkLandmarks(filePaths) {
    const results = {
        passed: [],
        failed: []
    };
    
    filePaths.forEach(filePath => {
        if (hasMainLandmark(filePath)) {
            results.passed.push(filePath);
        } else {
            results.failed.push(filePath);
        }
    });
    
    return results;
}

// Export all functions for use in tests and other modules
export { hasMainLandmark, addMainLandmark, fixReactLandmarks, checkLandmarks };