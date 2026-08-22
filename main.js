const fs = require('fs');

const filePath = 'docs/dependency-graph.html';
if (!fs.existsSync(filePath)) {
  console.error('File not found:', filePath);
  process.exit(1);
}

let content = fs.readFileSync(filePath, 'utf8');

// Add scope="col" to <th> tags that lack a scope attribute (26 occurrences)
content = content.replace(/<th(?![^>]*scope)/gi, '<th scope="col"');

fs.writeFileSync(filePath, content);
console.log('Fixed REACT_027: added scope="col" to table headers in', filePath);