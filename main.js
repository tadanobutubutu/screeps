const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'index.html');
const content = fs.readFileSync(htmlPath, 'utf8');
console.log(content);

// Create the function to add SVG accessibility props
function addAccessibilityProps(html) {
  const svgPattern = /<svg[^>]*>(?:(?!<\/svg>)[^<]*)*<\/svg>/gi;
  let match;

  // Loop through each match
  while ((match = svgPattern.exec(html)) !== null) {
    const accessibilityProps = '<aerial:role aria-label="Main SVG">';

    // Replace the matched SVG string with the modified SVG string having accessibility props
    html = html.replace(match[0], match[0] + accessibilityProps);
  }

  return html;
}

// Update the content variable by adding the above created function
content = addAccessibilityProps(content);
console.log(content);

// Export the updated content
module.exports = content;