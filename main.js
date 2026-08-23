const fs = require('fs');
const path = require('path');

// Files affected by the REACT_041 rule
const affectedFiles = [
    'app/layout.tsx',
    'dashboard/app/layout.tsx'
];

// Process each affected file
affectedFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;
        
        // Pattern to match SVG opening tag (handles multiline attributes)
        // We look for SVGs that contain a title element (favicon pattern)
        const svgWithTitlePattern = /(<svg\b[^>]*>[\s\S]*?)<title([^>]*)>([\s\S]*?)<\/title>/gi;
        
        content = content.replace(svgWithTitlePattern, (fullMatch, svgTag, titleAttrs, titleText) => {
            // Check if already has aria-labelledby
            if (svgTag.includes('aria-labelledby') || svgTag.includes('aria-label')) {
                return fullMatch;
            }
            
            // Check if title already has an id
            if (titleAttrs.includes('id=')) {
                return fullMatch;
            }
            
            modified = true;
            
            // Add id to title
            const newTitleAttrs = titleAttrs ? `${titleAttrs} id="svg-title"` : ' id="svg-title"';
            const newTitle = `<title${newTitleAttrs}>${titleText}</title>`;
            
            // Add aria-labelledby to svg tag
            const newSvgTag = svgTag.replace(/>\s*$/, ' aria-labelledby="svg-title">');
            
            return newSvgTag + newTitle;
        });
        
        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Fixed: ${file}`);
        } else {
            console.log(`No changes needed: ${file}`);
        }
    } else {
        console.log(`File not found: ${file}`);
    }
});

module.exports = {};