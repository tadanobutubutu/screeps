const fs = require('fs');

const filePath = './docs/dependency-graph.html';
const regex = /<th.*?>.*?<\/th>/gm;
let match;

while ((match = regex.exec(fs.readFileSync(filePath, 'utf-8'))) !== null) {
  const modifiedTh = match[0].replace('<th', '<th scope="col>');
  const content = fs.readFileSync(filePath, 'utf-8').replace(match[0], modifiedTh);
  fs.writeFileSync(filePath, content);
}

console.log('Table headers updated.');