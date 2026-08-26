const fs = require('fs');

// Fix for REACT_027: add scope attributes to table headers in docs/dependency-graph.html
function fixTableStructure() {
  try {
    const filePath = 'docs/dependency-graph.html';
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');

    // Column headers (rotated): those containing source path divs get scope="col"
    content = content.replace(
      /<th\b([^>]*)>(\s*<div>src\/[^<]*<\/div>\s*)<\/th>/gi,
      (match, attrs, inner) => {
        if (attrs.toLowerCase().includes('scope')) return match;
        return '<th scope="col"' + attrs + '>' + inner + '</th>';
      }
    );

    // Row headers (remaining <th> tags without a scope attribute) get scope="row"
    content = content.replace(
      /<th\b([^>]*)>/gi,
      (match, attrs) => {
        if (attrs.toLowerCase().includes('scope')) return match;
        return '<th scope="row"' + attrs + '>';
      }
    );

    fs.writeFileSync(filePath, content);
  } catch (e) {
    // Silently ignore if file is missing or unreadable
  }
}

// Apply fix on load so the HTML file is corrected
fixTableStructure();

// Preserve existing module interface and add the new export
const existingExports = (typeof module !== 'undefined' && module.exports) ? module.exports : {};
if (typeof existingExports === 'object' && existingExports !== null) {
  existingExports.fixTableStructure = fixTableStructure;
} else {
  // If exports was a primitive/function, wrap minimally to preserve
  module.exports = { ...existingExports, fixTableStructure };
}
if (typeof module !== 'undefined') module.exports = existingExports;