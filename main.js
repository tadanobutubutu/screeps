// main.js - Fix React Landmarks (REACT_017) by adding <main> landmarks

const fs = require('fs');
const path = require('path');

const files = [
  'app/layout.tsx',
  'docs/index.html',
  // Add other affected files as needed
];

function addMainLandmark(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const hasMain = content.includes('<main>') || content.includes('<main ');

    if (hasMain) {
      console.log(`Skipped (already has <main>): ${filePath}`);
      return;
    }

    const ext = path.extname(filePath);

    // For JSX/TSX files with body, wrap children in main
    if (ext === '.tsx' || ext === '.jsx') {
      if (content.includes('<body>')) {
        content = content.replace(
          /<body([^>]*)>((?:(?!<\/body>)[\s\S])*)<\/body>/i,
          (match, attrs, children) => {
            return `<body${attrs}>\n<main>\n${children}\n</main>\n</body>`;
          }
        );
      }
    }

    // For HTML files, add main landmark after body opening
    if (ext === '.html') {
      if (content.includes('<body') && !content.includes('<main')) {
        content = content.replace(
          /<body([^>]*)>/i,
          (match, attrs) => {
            return `<body${attrs}>\n<main>`;
          }
        );
        content = content.replace(
          /<\/body>/i,
          () => {
            return `</main>\n</body>`;
          }
        );
      }
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed: ${filePath}`);
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err.message);
  }
}

files.forEach(file => {
  const fullPath = path.resolve(file);
  if (fs.existsSync(fullPath)) {
    addMainLandmark(fullPath);
  } else {
    console.error(`File not found: ${fullPath}`);
  }
});