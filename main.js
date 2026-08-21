// main.js - Fix React Language Attribute (REACT_015) by adding lang attribute to <html>

const fs = require('fs');
const path = require('path');

const files = [
  'docs/dependency-graph.html', // Add the affected file here
  // Add other affected files as needed
];

function addLangAttribute(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const hasLang = /<html[\s>]/i.test(content);

    if (!hasLang) {
      // Add lang attribute to <html>
      content = content.replace(/<html[\s>]/i, '<html lang="en">');
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
    addLangAttribute(fullPath);
  }
});