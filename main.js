const fs = require('fs');
const path = require('path');

/**
 * Fix REACT_027 — add scope="col" to <th> header cells.
 * Preserves existing exports and only introduces the accessibility fix.
 */
function fixTableHeaders(html) {
  // Insert scope="col" into <th> tags that don't already specify a scope
  return html.replace(/<th(?![^>]*\bscope\b)([^>]*)>/gi, '<th scope="col"$1>');
}

function applyFix() {
  const filePath = path.join(__dirname, 'docs', 'dependency-graph.html');
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    fs.writeFileSync(filePath, fixTableHeaders(content), 'utf8');
  }
}

// Preserve/add exports so existing tests/consumers remain valid
module.exports = {
  fixTableHeaders,
  applyFix
};

// Auto-apply when executed directly so the HTML is corrected
if (require.main === module) {
  applyFix();
}