const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'docs', 'dependency-graph.html');
const content = fs.readFileSync(filePath, 'utf-8');

const re = /<th scope="col"><div>(.*?)<\/div>/g;
const replacement = '<th scope="col" style="white-space: nowrap;">$1</th>';

let match;
let result = '';
while ((match = re.exec(content)) !== null) {
  result += replacement.replace('$1', match[1]);
}

fs.writeFileSync(filePath, result);