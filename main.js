const fs = require('fs');

function addScopeToTh(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  // Change the anchor tag to a button for better accessibility
  const updatedContent = content.replace(/<a id="unrotate" href="#">rotate back<\/a>/g, '<button id="unrotate">rotate back</button>');
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Changed anchor tag to button for better accessibility in ${filePath}`);
}

addScopeToTh('docs/dependency-graph.html');