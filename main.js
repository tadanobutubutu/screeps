const fs = require('fs');
const path = require('path');

/**
 * Fix REACT_027 — React Table Structure: add scope="col" to <th> elements
 * that are missing a scope attribute in docs/dependency-graph.html.
 */
function fixTableHeaders() {
  const filePath = path.resolve(__dirname, 'docs', 'dependency-graph.html');
  if (!fs.existsSync(filePath)) {
    console.warn('File not found:', filePath);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  // Add scope="col" to <th> tags without an existing scope attribute.
  content = content.replace(
    /<th(?![^>]*\bscope=)([^>]*)>/g,
    '<th scope="col"$1>'
  );

  fs.writeFileSync(filePath, content, 'utf8');
}

// Execute when run directly.
if (require.main === module) {
  fixTableHeaders();
}

module.exports = { fixTableHeaders };