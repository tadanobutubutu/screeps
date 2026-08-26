const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'docs/dependency-graph.html');
const content = fs.readFileSync(htmlPath, 'utf8');
console.log(content);