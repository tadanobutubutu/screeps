// main.js
const fs = require('fs');
const path = require('path');

// Read the HTML template and ensure lang attribute is present
function generateHTML() {
  let htmlContent = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf8');
  
  // Check if lang attribute exists on html tag
  if (!htmlContent.includes('lang=')) {
    // Add lang="en" to the html element
    htmlContent = htmlContent.replace('<html>', '<html lang="en">');
  }
  
  return htmlContent;
}

module.exports = { generateHTML };