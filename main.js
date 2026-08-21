// main.js - Fix React Fake Link (REACT_036) by replacing anchor tags with buttons for in-page actions

const fs = require('fs');
const path = require('path');

const files = [
  'docs/dependency-graph.html',
  // Add other affected files as needed
];

function replaceAnchorsWithButtons(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');

    // Regex to find anchor tags with href="#" and no text content
    const regex = /<a[^>]*href="#"[^>]*>([^<]*)<\/a>/gi;

    // Replace the anchor tags with button elements
    content = content.replace(regex, (match, text) => {
      // Add button for the in-page action, including a `type="button"` attribute to avoid default behavior
      return `<button type="button" onclick="window.scrollTo(0, 0);">${text}</button>`;
    });

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed: ${filePath}`);
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err.message);
  }
}

files.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    replaceAnchorsWithButtons(fullPath);
  }
});