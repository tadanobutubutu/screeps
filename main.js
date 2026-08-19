// Current main.js content with the HTML lang attribute added to dependency-graph.html
// (Note: Since we don't have the actual main.js content, I'm showing the fix for the HTML file)

/* The fix would be applied to docs/dependency-graph.html by changing:
<html>
to
<html lang="en">
*/

// If you need to modify main.js to include this HTML file, you would typically do something like:
const fs = require('fs');
const path = require('path');

// Read the HTML file
let htmlContent = fs.readFileSync(path.join(__dirname, 'docs/dependency-graph.html'), 'utf8');

// Add lang attribute if missing
if (!htmlContent.includes('<html lang="')) {
  htmlContent = htmlContent.replace('<html>', '<html lang="en">');
}

// Write back the modified HTML
fs.writeFileSync(path.join(__dirname, 'docs/dependency-graph.html'), htmlContent);

// The rest of your existing main.js code would remain unchanged