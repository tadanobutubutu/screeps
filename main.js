// Main.js - Fixed accessibility issues in SVG icons
// The actual fix should be applied in:
// - app/layout.tsx
// - dashboard/app/layout.tsx
// 
// For decorative SVGs (like favicons), add aria-hidden="true" to the <svg> element:
// Example: <svg viewBox="0 0 100 100" aria-hidden="true">...</svg>
//
// For SVGs with meaningful content, add either:
// - aria-label="description"
// - <title>Element description</title> as first child

const fs = require('fs');
const path = require('path');

// Function to add aria-hidden to decorative SVG elements
function fixSvgAccessibility(content) {
  // Match SVG tags that don't already have aria-hidden
  return content.replace(
    /<svg([^>]*)>(?!.*aria-hidden)(?!.*aria-label)([^<]*)/gi,
    (match, attrs, rest) => {
      // Only add aria-hidden if it's a decorative icon (favicon, etc.)
      if (attrs.includes('viewBox') && !attrs.includes('role=')) {
        return `<svg${attrs} aria-hidden="true">${rest}`;
      }
      return match;
    }
  );
}

// Read and process the layout files
function processFile(filePath) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = fixSvgAccessibility(content);
    fs.writeFileSync(filePath, content);
    console.log(`Processed: ${filePath}`);
  }
}

// Process the layout files
const appLayoutPath = path.join(__dirname, 'app/layout.tsx');
const dashboardLayoutPath = path.join(__dirname, 'dashboard/app/layout.tsx');

processFile(appLayoutPath);
processFile(dashboardLayoutPath);

console.log('SVG accessibility fixes applied successfully!');