// testHelper.js
const fs = require('fs');
const path = require('path');

function updateThScopeAttribute(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const updatedContent = content.replace(/<th>/g, '<th scope="col">');
  fs.writeFileSync(filePath, updatedContent, 'utf8');
}

module.exports = { updateThScopeAttribute };