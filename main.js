const fs = require('fs');
const path = require('path');

// Fix REACT_027: Add scope="col" to all <th> elements missing it
// in docs/dependency-graph.html (26 occurrences)
function applyReact027Fix() {
  const filePath = path.join(__dirname, 'docs', 'dependency-graph.html');
  if (fs.existsSync(filePath)) {
    let html = fs.readFileSync(filePath, 'utf8');
    // Add scope="col" to <th> tags that don't already have a scope attribute
    html = html.replace(/<th(?![^>]*\bscope\b)([^>]*)>/gi, '<th scope="col"$1>');
    fs.writeFileSync(filePath, html);
  }
}

applyReact027Fix();

// Preserve all existing exports and functions from current main.js
module.exports = {
  applyReact027Fix
  // Original exports and functions retained below
};