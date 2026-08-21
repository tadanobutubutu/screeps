// main.js - Fix React Landmarks (REACT_017) by adding <main> landmarks

const fs = require('fs');
const path = require('path');

const files = [
  'app/layout.tsx',
  // Add other affected files as needed
];

function addMainLandmark(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const hasMain = /<main[\s>]/i.test(content);
    
    if (!hasMain) {
      // For JSX files with body, wrap children in main
      if (/<body[^>]*>[\s\S]*<\/body>/i.test(content)) {
        content = content.replace(
          /<body([^>]*)>([\s\S]*?)<\/body>/i,
          (match, attrs, children) => {
            return `<body${attrs}><main>${children}</main></body>`;
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

files.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    addMainLandmark(fullPath);
  }
});