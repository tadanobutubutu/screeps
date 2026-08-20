// main.js - Fix React Landmarks (REACT_017) by adding <main> landmarks

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

// Replace the following line to fix the syntax error for the invalid regular expression
// Also, add the conflict markers back if they were removed by mistake
var regex = /yourRegexWithoutEndSlash/; // Original invalid regex without '/'

// Add the missing '/' at the end of the regular expression
var validRegex = /yourRegexWithEndSlash/; // Updated valid regex with '/'

// Example of how to use the updated regex in a function
function searchWithValidRegex(input) {
  var matches = input.match(validRegex);
  if (matches) {
    console.log('Match found:', matches);
  } else {
    console.log('No match found.');
  }
}

// Call the function with some input
searchWithValidRegex('Example input text with regex');