const fs = require('fs');

function addScopeToTh(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const updatedContent = content.replace(/<th scope="col"><div>(.*?)<\/div>\s*<\/th>/g, '<th scope="col"><div>$1</div><th>');
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Added scope attribute to 'th' elements in ${filePath}`);
}

addScopeToTh('docs/dependency-graph.html');