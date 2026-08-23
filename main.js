// Could you please paste the contents of `main.js`, especially the sections with conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`), so I can help resolve them?

const fs = require('fs');

// REACT_027: Add scope="col" to all <th> elements in docs/dependency-graph.html
const filePath = 'docs/dependency-graph.html';
if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/<th>/g, '<th scope="col">');
  fs.writeFileSync(filePath, content);
}

module.exports = {};