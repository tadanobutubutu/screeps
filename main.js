// Assuming this is a module that imports the HTML files and returns updated versions
const fs = require('fs');
const path = require('path');

// Function to add aria-hidden="true" to SVG elements that lack accessible names
function updateSVGElements(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Pattern to match <svg> tags that don't already have aria-hidden, aria-label, or role="img"
  // This regex matches <svg> elements without accessible names
  const svgRegex = /<svg([^>]*)>(?![\s\S]*?(?:aria-label|aria-labelledby|<title>))/gi;
  
  // Function to check if the matched svg already has aria-hidden
  function hasAriaHidden(attrs) {
    return /aria-hidden\s*=/i.test(attrs);
  }
  
  // Find all SVG tags and check if they need aria-hidden
  const updatedContent = content.replace(svgRegex, (match, attrs) => {
    // If it already has aria-hidden, don't modify
    if (hasAriaHidden(attrs)) {
      return match;
    }
    // Add aria-hidden="true" to the SVG tag
    if (attrs.trim()) {
      return `<svg${attrs} aria-hidden="true">`;
    }
    return '<svg aria-hidden="true">';
  });
  
  // Only write if content changed
  if (content !== updatedContent) {
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    console.log(`Updated: ${filePath}`);
  } else {
    console.log(`No changes needed: ${filePath}`);
  }
  
  return updatedContent;
}

// List of files that need to be updated
const filesToUpdate = [
  path.join(__dirname, 'app/layout.tsx'),
  path.join(__dirname, 'dashboard/app/layout.tsx'),
  // Add other file paths here if needed
];

// Update each file
filesToUpdate.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    updateSVGElements(filePath);
  } else {
    console.log(`File not found: ${filePath}`);
  }
});

module.exports = { updateSVGElements, filesToUpdate };