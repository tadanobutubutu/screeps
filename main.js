// main.js - Fix React Landmarks (REACT_017, REACT_025) by adding <main> landmarks and removing duplicates

const fs = require('fs');
const path = require('path');

const files = [
  'app/layout.tsx',
  'app/page.tsx',
  'app/error.tsx',
  'app/loading.tsx',
  // Add other affected files as needed
];

function addMainLandmark(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const hasMain = content.includes('<main');

    if (!hasMain) {
      // For JSX files with body, wrap children in main
      if (filePath.endsWith('.tsx') || filePath.endsWith('.jsx')) {
        content = content.replace(
          /<body[^>]*>([\s\S]*)<\/body>/,
          (match, children) => {
            return `<body>${children.replace(/^(\s*)/, '$1<main>')}</main></body>`;
          }
        );
      }
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed: ${filePath}`);
    }
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err.message);
  }
}

function removeDuplicateMainLandmarks(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Find all return statements with main elements
    const mainMatches = content.match(/return\s*\([\s\S]*?<\/main>\s*\)/g) || [];
    
    if (mainMatches.length > 1) {
      console.log(`Found ${mainMatches.length} main elements in ${filePath}`);
      
      // Replace duplicate <main> tags with <section> tags (keep the first one as main)
      let mainCount = 0;
      content = content.replace(/<main([^>]*)>/g, (match, attrs) => {
        if (mainCount === 0) {
          mainCount++;
          return match; // Keep the first <main>
        }
        mainCount++;
        return `<section${attrs}>`; // Replace subsequent <main> with <section>
      });
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed duplicate main landmarks in: ${filePath}`);
    }
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err.message);
  }
}

files.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    addMainLandmark(fullPath);
    removeDuplicateMainLandmarks(fullPath);
  }
});

// Export functions for testing and reuse
module.exports = {
  addMainLandmark,
  removeDuplicateMainLandmarks,
};