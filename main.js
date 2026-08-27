const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'template.html');
const content = fs.readFileSync(htmlPath, 'utf8');

// Replace the fake link with a button for accessibility
const fixedContent = content.replace(
  /<a id="unrotate" href="#">rotate back<\/a>/g,
  '<button id="unrotate">rotate back</button>'
);

console.log(fixedContent);