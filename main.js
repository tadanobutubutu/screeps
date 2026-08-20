// Existing code from main.js goes here
// ...

// New function or changes requested in the issue go here
// Fix React SVG Accessible Name (REACT_041) by adding aria-hidden="true" to decorative SVGs
const fixSvgAccessibleName = () => {
  const fs = require('fs');
  const path = require('path');
  
  const filesToFix = [
    path.join('app', 'layout.tsx'),
    path.join('dashboard', 'app', 'layout.tsx')
  ];
  
  filesToFix.forEach(filePath => {
    try {
      if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Find SVG elements that don't have aria-label, aria-labelledby, or title child
        // and add aria-hidden="true" to them
        const updatedContent = content.replace(
          /<svg(?![^>]*\b(aria-label|aria-labelledby)\s*=)(?![^>]*\baria-hidden\s*=)([^>]*?)>/gi,
          (match, attributes) => {
            // Check if it already has aria-hidden
            if (!attributes.includes('aria-hidden')) {
              // Add aria-hidden="true" to the SVG tag
              return `<svg aria-hidden="true"${attributes}>`;
            }
            return match;
          }
        );
        
        if (content !== updatedContent) {
          fs.writeFileSync(filePath, updatedContent, 'utf8');
          console.log(`Fixed SVG accessible name in: ${filePath}`);
        } else {
          console.log(`No changes needed in: ${filePath}`);
        }
      } else {
        console.log(`File not found: ${filePath}`);
      }
    } catch (error) {
      console.error(`Error fixing ${filePath}:`, error);
    }
  });
};

// Ensure to call fixSvgAccessibleName() if needed to apply the fix
// fixSvgAccessibleName();

// Rest of the main.js code goes here
// ...