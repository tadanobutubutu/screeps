// main.js

/**
 * Fix for REACT_041 - React SVG Accessible Name
 * 
 * The SVG elements used for favicons need accessible names to be properly
 * announced by screen readers. This fix adds a <title> child element to
 * each SVG, providing an accessible name.
 */

const fs = require('fs');
const path = require('path');

// Files to fix
const filesToFix = [
  'app/layout.tsx',
  'dashboard/app/layout.tsx'
];

// Regex pattern to match SVG elements and add <title> if missing
// This pattern looks for SVG tags and adds a title if not present
const svgTitlePattern = /(<svg[^>]*>)(?!\s*<title)/gi;
const svgTitleReplacement = '$1<title>Screeps Dashboard</title>';

// Apply fixes to each file
filesToFix.forEach(file => {
  const filePath = path.resolve(file);
  
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if file contains SVG favicon definitions
    if (content.includes('icons:') && content.includes('viewBox')) {
      // Add title to SVG elements in the icons configuration
      // This regex specifically targets SVG tags in icon definitions
      const iconSvgPattern = /(<svg[^>]*>(?![\s\S]*?<title>))/gi;
      
      if (iconSvgPattern.test(content)) {
        // Reset lastIndex since we're testing
        iconSvgPattern.lastIndex = 0;
        
        // Replace with SVG containing title
        const updatedContent = content.replace(iconSvgPattern, (match) => {
          return match.replace('>', '><title>Screeps Dashboard</title>');
        });
        
        fs.writeFileSync(filePath, updatedContent);
        console.log(`Fixed: ${file}`);
      } else {
        console.log(`No action needed for: ${file} (title already exists or no SVG found)`);
      }
    } else {
      console.log(`Skipped: ${file} (no icon definitions found)`);
    }
  } else {
    console.log(`File not found: ${file}`);
  }
});

console.log('Fix applied successfully!');