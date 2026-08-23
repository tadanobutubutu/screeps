// Could you please paste the contents of `main.js`, especially the sections with conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`), so I can help resolve them?

// TODO: Add back any required exports that might have been removed
// Here's an example of how to export a required function from another file:
// const { myFunction } = require('./otherFile');
// module.exports = { myFunction };

const fs = require('fs');
const path = require('path');

/**
 * Replaces a fake anchor link (<a href="#">) with a proper button.
 * @param {string} filePath - Path to the file to fix.
 */
function fixFakeLink(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    // Replace <a id="unrotate" href="#">...</a> with <button id="unrotate" type="button">...</button>
    const newContent = content.replace(
      /id="unrotate"\s+href="#"/g,
      '<button id="unrotate" type="button">rotate back</button>'
    );
    fs.writeFileSync(filePath, newContent);
  } catch (err) {
    console.error(`Failed to fix ${filePath}:`, err.message);
  }
}

// Apply the fix to the documented file
const docsGraphPath = path.join(__dirname, 'docs', 'dependency-graph.html');
if (fs.existsSync(docsGraphPath)) {
  fixFakeLink(docsGraphPath);
}

module.exports = {};