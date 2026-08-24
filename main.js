const fs = require('fs');

function addScopeToTh(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  // Change the anchor tag to a button for better accessibility
  const updatedContent = content.replace(/<a id="unrotate" href="#">rotate back<\/a>/g, '<button id="unrotate" aria-label="rotate back">rotate back</button>');
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Changed anchor tag to button for better accessibility in ${filePath}`);
}

function addAriaAttribute(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  // Add an ARIA attribute to the button for accessibility
  const updatedContent = content.replace(/<button id="unrotate">rotate back<\/button>/g, '<button id="unrotate" aria-label="rotate back">rotate back</button>');
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Added ARIA attribute to button for better accessibility in ${filePath}`);
}

// New Function: Add language attribute to HTML element
function addLangAttribute(filePath){
  const content = fs.readFileSync(filePath, 'utf8');
  const updatedContent = content.replace(/<html>/, '<html lang="en">');
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Added lang attribute to HTML element in ${filePath}`);
}

addScopeToTh('docs/dependency-graph.html');
addAriaAttribute('docs/dependency-graph.html');
addLangAttribute('docs/dependency-graph.html');