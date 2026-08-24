const fs = require('fs');

// Fix REACT_027: Add scope="col" to <th> elements in dependency graph
const htmlPath = 'docs/dependency-graph.html';
if (fs.existsSync(htmlPath)) {
  let html = fs.readFileSync(htmlPath, 'utf8');
  html = html.replace(/<th>/g, '<th scope="col">');
  fs.writeFileSync(htmlPath, html);
}