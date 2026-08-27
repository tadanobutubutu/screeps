const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'docs/dependency-graph.html');
const content = fs.readFileSync(htmlPath, 'utf8');

// Add accessible name to SVG for favicon
const updatedContent = content.replace(/<svg.*?>/g, (svg) => {
  // Check if the SVG already has an accessible name
  if (svg.includes('aria-label') || svg.includes('title') || svg.includes('aria-hidden')) {
    return svg;
  }
  // Add aria-hidden="true" if no accessible name or title is present
  return svg.replace('</svg>', ' aria-hidden="true"></svg>');
});

fs.writeFileSync(htmlPath, updatedContent);

console.log(content);