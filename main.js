const fs = require('fs');
const path = require('path');

const files = [
  'app/layout.tsx',
  'dashboard/app/layout.tsx',
  // Add other affected files as needed
];

function addMainLandmark(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const hasMain = /<main[\s>]/i.test(content);

    if (!hasMain) {
      // For JSX files with body, wrap children in main
      if (content.includes('<body>') || content.includes('<Body>')) {
        content = content.replace(
          /(<(?:body|Body)[^>]*>\s*)({[\s\S]*?})(\s*<\/(?:body|Body)>)/i,
          (match, open, children, close) => {
            return `${open}<main>${children}</main>${close}`;
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
  const fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    addMainLandmark(fullPath);
  }
});