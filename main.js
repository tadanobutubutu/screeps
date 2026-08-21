// main.js - Fix React Landmarks (REACT_017) by adding <main> landmarks
// Fix React Table Structure (REACT_027) by adding scope attributes to <th> elements
// REACT_015: React Language Attribute - Add lang attribute to html element
// REACT_025: React Unique Landmarks - Ensure landmarks have unique accessible names
// REACT_036: React Fake Link - Use real <a> tags or properly role/link elements
// REACT_041: React SVG Accessible Name - Add title or aria-label to SVGs

function addMainLandmark(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const hasMain = content.includes('<main');

    if (!hasMain) {
      // For JSX files with body, wrap children in main
      if (filePath.endsWith('.tsx') || filePath.endsWith('.jsx')) {
        content = content.replace(
          /(<body[^>]*>)([\s\S]*?)(<\/body>)/gi,
          (match, open, children, close) => {
            return open + '\n      <main>\n        ' + children.trim() + '\n      </main>\n' + close;
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

function addScopeToHeaders(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    // Match <th> tags without scope attribute and add appropriate scope
    content = content.replace(
      /<th(?![^>]*\bscope=)([^>]*)>/gi,
      (match, attributes) => {
        // Check if this is likely a row header (first cell in a row pattern)
        const isProbablyRowHeader = attributes.includes('role="rowheader"') ||
                                     attributes.includes('class=');

        // Determine scope - default to "col" for table headers
        // "row" scope is typically for row headers (first cell of each row)
        const scopeValue = isProbablyRowHeader ? 'row' : 'col';

        return `<th scope="${scopeValue}"${attributes}>`;
      }
    );

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed scope attributes in: ${filePath}`);
    }
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err.message);
  }
}

const files = [
  'app/layout.tsx',
  // Add other affected files as needed
];

files.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    addMainLandmark(fullPath);
    addScopeToHeaders(fullPath);
  }
});

module.exports = {
  addMainLandmark,
  addScopeToHeaders
};