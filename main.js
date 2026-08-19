// Fix for REACT_015: Add lang attribute to <html> element
// Ensures screen readers pick the correct language voice.
// See: docs/dependency-graph.html#L2

/**
 * Adds the `lang="en"` attribute to the `<html>` tag of an HTML file if missing.
 * @param {string} filePath - Path to the HTML file to fix.
 */
function fixLangAttribute(filePath) {
  const fs = require('fs');
  const path = require('path');
  const absolutePath = path.resolve(filePath);
  let content = fs.readFileSync(absolutePath, 'utf8');

  // Add lang="en" to <html> if not already present
  if (!/^<html[^>]* lang=/mi.test(content)) {
    content = content.replace(/^<html /mi, '<html lang="en" ');
    fs.writeFileSync(absolutePath, content);
  }

  // Include the missing SVG components from the React files
  const pathToReactLayout = path.join(__dirname, '..', '..', 'app', 'layout.tsx');
  const reactLayoutContent = fs.readFileSync(pathToReactLayout, 'utf8');
  const svgReactLayout = /<svg[^>]+aria-hidden="true">[^<]*<\/svg>/.exec(reactLayoutContent)[0];

  // Add the SVG components to the HTML file
  content = content.replace(/<head>/, `${content.match(/<head>/)[0]}${svgReactLayout}`);

  fs.writeFileSync(absolutePath, content);
}

module.exports = { fixLangAttribute };