const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'docs', 'dependency-graph.html');
const contents = fs.readFileSync(filePath, 'utf-8');

let lines = contents.split('\n');
for (let i = 0, len = lines.length; i < len; i++) {
  if (lines[i].startsWith('<th scope')) {
    // Find the next line with matching end tags
    let endTagIndex = lines.findIndex((line, index) => index > i && (line.startsWith('<td') || line.startsWith('</th')));
    if (endTagIndex > i) {
      // Add the `scope` attribute to the next `<td>`
      lines[i + 1] = lines[i + 1].replace('<td', '<td scope="col">');
    }
  }
}

const newContents = lines.join('\n');
fs.writeFileSync(filePath, newContents, 'utf-8');
console.log('Table headers have been updated.');