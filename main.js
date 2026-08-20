// main.js - Accessibility fix for REACT_041
// This file handles the SVG icon accessibility fixes

/**
 * Fix for SVG favicon accessibility issue (REACT_041)
 * Adds aria-hidden="true" to decorative SVG elements that don't need screen reader announcement
 */

const fs = require('fs');
const path = require('path');

// Files that need the SVG accessibility fix
const filesToFix = [
  'app/layout.tsx',
  'dashboard/app/layout.tsx'
];

/**
 * Adds aria-hidden="true" to SVG elements in layout files
 * This prevents screen readers from announcing raw SVG code
 */
function fixSVGAccessibility() {
  filesToFix.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Fix SVG elements by adding aria-hidden="true" attribute
      // This is appropriate for decorative favicon SVGs
      content = content.replace(
        /<svg(?![^>]*aria-label)(?![^>]*aria-hidden)(?![^>]*><title)/gi,
        (match) => {
          if (match.includes('favicon') || match.includes('icon')) {
            return match.replace('<svg', '<svg aria-hidden="true"');
          }
          return match;
        }
      );
      
      fs.writeFileSync(filePath, content);
      console.log(`Fixed SVG accessibility in: ${file}`);
    }
  });
}

fixSVGAccessibility();

module.exports = { fixSVGAccessibility };