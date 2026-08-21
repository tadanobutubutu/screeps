// Fix REACT_036: replace fake link with button
const fs = require('fs');
const file = 'docs/dependency-graph.html';
let content = fs.readFileSync(file, 'utf-8');
content = content.replace(
  /<a id="unrotate" href="#">rotate back<\/a>/,
  '<button id="unrotate" type="button" onclick="unrotate()">rotate back</button>'
);
fs.writeFileSync(file, content);